const { Comments } = require('../model');
const { User } = require('../model');

module.exports = {
    async addComment(req, res) {
        // req.check('captcha', 'کد امنیتی را وارد کنید').notEmpty();
        // req.check('email', 'ایمیل را درست وارد کنید.').isEmail();
        // req.check('name', 'نام خود را وارد کنید.').notEmpty();
        // req.check('text', 'متن پیام را بنویسید.').notEmpty();

        // const errors = req.validationErrors();
        // if (errors) {
        //     return res.status(401).send({
        //         error: errors,
        //     });
        // }

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
        console.log('here');
        let comments = await Comments.findAll().catch(e => {
            return res.json({ msg: 'An error occured' });
        });
        res.status(200).send(comments);
    },
};
