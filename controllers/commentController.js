const { Comments } = require('../model');
const { User } = require('../model');
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
        };

        try {
            await Comments.create(obj);
            return res.json({ success: true, msg: 'Message has been sent' });
        } catch (err) {
            res.status(401);

            return res.json({ success: false, msg: 'An error occured' });
        }
    },
    async getComments(req, res) {
        let comments = await Comments.findAll({
            include: [{ model: User, attributes: ['name'] }],
        }).catch(e => {
            return res.json({ msg: 'An error occured' });
        });
        res.status(200).send(comments);
    },
    async deleteComments(req, res) {
        const { id } = req.body;
        Comments.destroy({
            where: { id },
        }).catch(function (error) {
            res.status(401);
        });
    },
};
