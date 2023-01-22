const { Comments } = require('../model');
const { User } = require('../model');

module.exports = {
    async addComment(req, res) {
        // req.check('captcha', 'کد امنیتی را وارد کنید').notEmpty();
        // req.check('email', 'ایمیل را درست وارد کنید.').isEmail();
        // req.check('name', 'نام خود را وارد کنید.').notEmpty();
        // req.check('text', 'متن پیام را بنویسید.').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            return res.status(401).send({
                error: errors,
            });
        }
        let email = req.body.email;
        let name = req.body.name;
        let text = req.body.text;
        let parent_id = req.body.parent_id;
        let obj = {
            email: email,
            name: name,
            text: text,
            parent_id: parent_id,
        };
        try {
            await Comments.create(obj);
            return res.json({ success: true, msg: 'پیام با موفقیت ارسال شد' });
        } catch (err) {
            res.status(401);
            return res.json({ success: false, msg: 'خطایی رخ داد' });
        }
    },
    async getComments(req, res) {
        let comments = await Comments.findAll().catch(e => {
            return res.json({ msg: 'خطایی رخ داد' });
        });
        res.status(200).send(comments);
    },
};
