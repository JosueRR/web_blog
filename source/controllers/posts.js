const Post = require('../models').Post;
const Account = require('../models').Accounts;
const Tag = require('../models').Tag;
const Post_tag = require('../models').Post_tag;
const Comment = require('../models').Comment;

class PostController {
    async index(req, res, next) {
        const pageAsNumber = Number.parseInt(req.params.id);
        let isAdmin = false;
        let isRegistered = false;

        let page = 0;
        if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
            page = pageAsNumber;
        }

        let size = 5;

        // Find all the existing posts in the blog
        const posts = await Post.findAndCountAll({
            limit: size,
            offset: page * size,
            order: [['createdAt', 'DESC']], // Order by 'createdAt' column in descending order
            include: [
                Account,
                Tag,
                Comment
            ]
        });

        // Find 5 top existing tags in the blog
        const tags = await Tag.findAll({
            limit: 5,
            include: [
                Post
            ]
        });

        // Find 5 top existing accounts in the blog
        const accounts = await Account.findAll({
            limit: 5

        });

        // In case the user already login
        if (req.session.loggedin == true) {
            const account = await Account.findOne({
                where: {
                    username: req.session.username,
                    password: req.session.password
                }
            });
            // Could not find the user
            if (account === null) {
                console.log('User not found!');
                // Not login
            } else {
                isAdmin = account.isAdmin;
                isRegistered = account.isRegistered;
                return res.render('posts/index', { title: "JR's Journal", accounts: accounts, posts: posts.rows, tags: tags, isRegistered: isRegistered, isAdmin: isAdmin, flashMessage: req.session.flashMessage, totalPages: Math.ceil(posts.count / Number.parseInt(size)) });
            }
        }

        // In case the user have not login
        if (req.session.flashMessage) {
            res.render('posts/index', { title: "JR's Journal", accounts: accounts, posts: posts.rows, tags: tags, isRegistered: isRegistered, isAdmin: isAdmin, flashMessage: req.session.flashMessage, totalPages: Math.ceil(posts.count / Number.parseInt(size)) });
        }
        else {
            res.render('posts/index', { title: "JR's Journal", accounts: accounts, posts: posts.rows, tags: tags, isRegistered: isRegistered, isAdmin: isAdmin, totalPages: Math.ceil(posts.count / Number.parseInt(size)) });
        }
    }

    async create(req, res, next) {
        let isAdmin = false;
        let isRegistered = false;
        if (req.session.loggedin == true) {
            const account = await Account.findOne({
                where: {
                    username: req.session.username,
                    password: req.session.password
                }
            });
            // Could not find the user
            if (account === null) {
                req.session.flashMessage = 'User not found!';
            } else {
                isAdmin = account.isAdmin;
                isRegistered = account.isRegistered;
            }
        }
        if (req.method === 'POST') {
            const account = await Account.findOne({
                where: {
                    username: req.session.username,
                    password: req.session.password
                }
            });

            let tag = await Tag.findOne({
                where: {
                    tagName: req.body.tag
                }
            });

            if (!tag) {
                tag = await Tag.create({ tagName: req.body.tag });
            }

            const post = await Post.create({
                title: req.body.title,
                body: req.body.body,
                accountId: account.id
            });

            await post.addTag(tag);

            res.redirect('/posts');
        } else {
            res.render('posts/create', { title: "JR's Journal", isAdmin: isAdmin, isRegistered: isRegistered});
        }
    }

    async view(req, res, next) {
        let isAdmin = false;
        let isRegistered = false;
        if (req.session.loggedin == true) {
            const account = await Account.findOne({
                where: {
                    username: req.session.username,
                    password: req.session.password
                }
            });
            // Could not find the user
            if (account === null) {
                req.session.flashMessage = 'User not found!';
            } else {
                isAdmin = account.isAdmin;
                isRegistered = account.isRegistered;
            }
        }
        const comments = await Comment.findAll({
            where: {
                postId: req.params.id
            },
            include: [
                Account
            ]
        });
        const post = await Post.findOne({ where: { id: req.params.id } });
        res.render('posts/view', { title: post.title, postId: req.params.id, body: post.body, comments: comments, isAdmin: isAdmin, isRegistered: isRegistered });
    }

    async showPostsUser(req, res, next) {
        let isAdmin = false;
        let isRegistered = false;
        const posts = await Post.findAll({
            where: {
                accountId: req.params.id
            }
        });
        if (req.session.isAdmin == 1 && req.session.loggedin == true) {
            isAdmin = true;
            isRegistered = true;
            return res.render('posts/showPostsUser', { title: 'Posts made by User', posts: posts, isAdmin: isAdmin, isRegistered: isRegistered });
        } else {
            return res.render('posts/showPostsUser', { title: 'Posts made by User', posts: posts, isAdmin: isAdmin, isRegistered: isRegistered });
        }
    }

    async update(req, res, next) {
        let isAdmin = false;
        let isRegistered = false;
        if (req.session.loggedin == true) {
            const account = await Account.findOne({
                where: {
                    username: req.session.username,
                    password: req.session.password
                }
            });
            // Could not find the user
            if (account === null) {
                req.session.flashMessage = 'User not found!';
            } else {
                isAdmin = account.isAdmin;
                isRegistered = account.isRegistered;
            }
        }
        if (req.method === 'POST') {
            await Post.update(
                {
                    title: req.body.title,
                    body: req.body.body
                },
                {
                    where: {
                        id: req.params.id
                    }
                });
            res.redirect('/posts');
        }
        else {
            const post = await Post.findOne({
                where: {
                    id: req.params.id
                }
            });
            res.render('posts/update', { title: "JR's Journal, edit", post: post, isAdmin: isAdmin, isRegistered: isRegistered });
        }
    }

    async delete(req, res, next) {
        await Post.destroy({
            where: {
                id: req.params.id
            }
        });
        await Post_tag.destroy({
            where: {
                postId: req.params.id
            }
        });
        req.session.flashMessage = 'Se eliminó la publicación';
        res.redirect('/posts');
    }

}

module.exports = PostController;