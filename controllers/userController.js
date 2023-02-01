const Sequelize = require('sequelize');
const { User } = require('../model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

function validPassword(password, dbSalt, dbHash) {
    if (!password || !password.trim() || !dbSalt || !dbHash) {
        return false;
    }
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, dbSalt, 1000, 64, 'sha512', (err, hash) => {
            if (err) reject(err);
            resolve(hash.toString('hex') === dbHash);
        });
    });
}
function giveSalt() {
    return crypto.randomBytes(16).toString('hex');
}

function giveHash(password, salt) {
    return crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');
}

const handleRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { password, email } = req.body;
    const user = await User.findOne({
        where: { email },
    });
    if (user) {
        return res.status(400).json({
            errors: [
                {
                    msg: 'This email has been registered before.',
                },
            ],
        });
    } else {
        try {
            req.body.salt = await giveSalt();
            req.body.hash = await giveHash(password, req.body.salt);
            const newUser = await User.create(req.body);

            //send login info like token user info, etc.
            const refreshTokenExp = 4 * 60 * 60;
            const { email, name, id } = newUser;
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        name,
                        email,
                        id,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXP }
            );
            const refreshToken = jwt.sign(
                { name, email, id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: refreshTokenExp + 's' }
            );
            newUser.update({ refresh_token: refreshToken });

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: refreshTokenExp * 1000,
            });

            //tokenExp is refresh token expiration time
            res.json({
                accessToken,
                user: {
                    name,
                    email,
                    id,
                },
                tokenExp: Date.now() + refreshTokenExp * 1000,
            });
        } catch (err) {
            res.status(500).json({
                errors: [
                    {
                        msg: 'An error has been occured please try again.',
                    },
                ],
            });
        }
    }
};

const handleLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const refreshTokenExp = 4 * 60 * 60;

    const { email, password } = req.body;

    const foundUser = await User.findOne({
        where: {
            email,
        },
    });

    if (!foundUser)
        return res
            .status(401)
            .json({ errors: [{ msg: 'Email and password are not valid.' }] }); //Unauthorized
    // evaluate password
    const match = await validPassword(password, foundUser.salt, foundUser.hash);

    if (match) {
        const { email, name, id } = foundUser;
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    name,
                    email,
                    id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXP }
        );
        const refreshToken = jwt.sign(
            { name, email, id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: refreshTokenExp + 's' }
        );
        foundUser.update({ refresh_token: refreshToken });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: refreshTokenExp * 1000,
        });

        //tokenExp is refresh token expiration time
        res.json({
            accessToken,
            user: {
                name,
                email,
                id,
            },
            tokenExp: Date.now() + refreshTokenExp * 1000,
        });
    } else {
        return res.status(401).json({
            errors: [
                {
                    msg: 'Email and password are not valid.',
                },
            ],
        }); //Unauthorized
    }
};

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({
        where: { refresh_token: refreshToken },
    });
    if (!foundUser) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) {
                return res.sendStatus(403);
            }

            const { name, email, id } = foundUser;
            const accessToken = jwt.sign(
                {
                    UserInfo: { name, email, id },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXP }
            );
            res.json({
                accessToken,
                user: {
                    name,
                    email,
                    id,
                },
            });
        }
    );
};

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({
        where: { refresh_token: refreshToken },
    });
    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        return res.sendStatus(204);
    }
    // Delete refreshToken in db
    foundUser.update({ refresh_token: null });
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
};

module.exports = {
    handleLogin,
    handleRegister,
    handleRefreshToken,
    handleLogout,
};
