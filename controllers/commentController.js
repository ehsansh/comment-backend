const { Comments } = require('../model');
const { User } = require('../model');
const { Vote } = require('../model');
const { validationResult } = require('express-validator');
module.exports = {
    async addComment(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { text, parent_id, user_id } = req.body;
        let obj = {
            text,
            parent_id,
            user_id,
            votes: 0,
        };

        try {
            const result = await Comments.create(obj);
            return res.json(result);
        } catch (err) {
            res.status(401);

            return res.json({ success: false, msg: 'An error occured' });
        }
    },
    async getComments(req, res) {
        let comments = await Comments.findAll({
            include: [{ model: User, attributes: ['name', 'id'] }],
        }).catch(e => {
            return res.json({ msg: 'An error occured' });
        });
        res.status(200).send(comments);
    },
    async deleteComments(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.body;
        Comments.destroy({
            where: { id },
        }).catch(function (error) {
            res.status(401);
        });
        res.status(200).send({});
    },
    async updateComments(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id, text } = req.body;
        await Comments.update({ text }, { where: { id } }).catch(e => {
            res.status(401);
        });
        res.status(200).send({});
    },
    async changeVote(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let { userId: user_id, commentId: comment_id, vote } = req.body;
        vote = parseInt(vote);
        const voteBefore = await Vote.findOne({
            where: { user_id, comment_id },
        });
        if (voteBefore) {
            if (voteBefore.vote !== vote) {
                await Comments.increment('votes', {
                    by: vote,
                    where: { id: comment_id },
                }).catch(e => {
                    res.status(401);
                });
                await Vote.increment('vote', {
                    by: vote,
                    where: { id: voteBefore.id },
                }).catch(e => {
                    res.status(401);
                });
            } else vote = 0;
        } else {
            await Vote.create({
                user_id,
                comment_id,
                vote,
            }).catch(e => {
                res.status(401);
            });
            await Comments.increment('votes', {
                by: vote,
                where: { id: comment_id },
            }).catch(e => {
                res.status(401);
            });
        }
        res.status(200).send({ vote });
    },
};
