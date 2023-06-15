const Account = require('../models').Accounts;
const Post = require('../models').Post;
const Tag = require('../models').Tag;
const Post_tag = require('../models').Post_tag;

class AdminController {
    async index(req, res, next) {
        let isAdmin = false;
        let isRegistered = false;
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
                req.session.flashMessage = 'User not found!';
                return res.render('common/notAvailable');
            } else {
                isAdmin = account.isAdmin;
                isRegistered = account.isRegistered;
            }
            // User is loggeding and is admin
            if (isAdmin) {
                // Find all the existing accounts
                const accounts = await Account.findAll();
                // Find all the existing tags
                const tags = await Tag.findAll();
                return res.render('admin/index', { title: 'Admin Control Center', tags: tags, accounts: accounts, isAdmin: isAdmin, isRegistered: isRegistered });
            } else {
                return res.render('common/notAvailable');
            }
        } else {
            return res.render('common/notAvailable');
        }
    }

    async showPosts(req, res, next) {
        if (req.session.isAdmin == 1 && req.session.loggedin == true) {
            let isAdmin = true;
            let isRegistered = true;
            const posts = await Post.findAll({
                where: {
                    accountId: req.params.id
                },
                include: [
                    Tag
                ]
            });
            return res.render('admin/postsList', { title: 'Admin Control Center', posts: posts, isAdmin: isAdmin, isRegistered: isRegistered });
        } else {
            return res.render('common/notAvailable');
        }
    }

    async showPostsWithTag(req, res, next) {
        const posts = await Post.findAll({
            include: [
                {
                  model: Tag,
                  where: {
                    id: req.params.id
                  }
                }
              ]
        });

        if (req.session.isAdmin == 1 && req.session.loggedin == true) {
            let isAdmin = true;
            let isRegistered = true;
            return res.render('admin/tagsList', { title: 'Admin Control Center', posts: posts, isAdmin: isAdmin, isRegistered: isRegistered });
        } else {
            return res.render('common/notAvailable');
        }
    }

    async changeRol(req, res, next) {
        if (req.session.isAdmin == 1 && req.session.loggedin == true) {
            const account = await Account.findOne({
                where: {
                    id: req.params.id
                }
            });
            let accountIsAdmin = null;
            account.isAdmin ? accountIsAdmin = 0 : accountIsAdmin = 1;
            await Account.update(
                {
                    isAdmin: accountIsAdmin
                },
                {
                    where: {
                        id: account.id
                    }
                });
            req.session.flashMessage = 'Se cambió el rol del usuario';
            res.redirect('/admin');
        } else {
            return res.render('common/notAvailable');
        }
    }

    async deleteAccount(req, res, next) {
        if (req.session.isAdmin == 1 && req.session.loggedin == true) {
            await Account.destroy({
                where: {
                    id: req.params.id
                }
            });
            req.session.flashMessage = 'Se eliminó la cuenta';
            res.redirect('/admin');
        } else {
            return res.render('common/notAvailable');
        }
    }
}

module.exports = AdminController;
