const Comment = require('../models').Comment;
const Post = require('../models').Post;


class CommentController {
    async writeComment(req, res, next) {
        if (req.method === 'POST') {
            if (req.session.loggedin == true) {
                const postId = req.params.id;
                await Comment.create({
                    comment: req.body.comment,
                    postId: postId,
                    accountId: req.session.accountId
                });
            return res.redirect('/');
            } else {
                return res.render('common/askForLogIn');
            }
        }
    }
}

module.exports = CommentController;
