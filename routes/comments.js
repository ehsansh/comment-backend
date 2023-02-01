const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

const { body } = require('express-validator');

router.post(
    '/vote',
    body('userId').not().isEmpty().isInt().escape(),
    body('commentId').not().isEmpty().isInt().escape(),
    body('vote').not().isEmpty().isInt().escape(),
    commentController.changeVote
);
router.post(
    '/update',
    body('text').not().isEmpty().escape(),
    body('id').not().isEmpty().escape(),
    commentController.updateComments
);
router.post(
    '/delete',
    body('id').not().isEmpty().escape(),
    commentController.deleteComments
);
router.get('/', commentController.getComments);
router.post(
    '/',
    body('text', 'Please enter your comment.').not().isEmpty().escape(),
    body('parent_id').not().isEmpty().escape(),
    body('user_id').not().isEmpty().escape(),
    commentController.addComment
);

module.exports = router;
