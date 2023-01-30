const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

const { body } = require('express-validator');

router.post('/vote', commentController.changeVote);
router.post('/update', commentController.updateComments);
router.post('/delete', commentController.deleteComments);
router.get('/', commentController.getComments);
router.post(
    '/',
    body('text', 'Please enter your comment.').not().isEmpty().escape(),
    body('parent_id').not().isEmpty().escape(),
    body('user_id').not().isEmpty().escape(),
    commentController.addComment
);

module.exports = router;
