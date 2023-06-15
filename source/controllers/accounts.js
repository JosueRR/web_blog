const Account = require('../models').Accounts;

class AccountController {
    async index(req, res, next) {
        res.render('account/login');
    }

    async login(req, res, next) {
        if (req.method === 'POST') {
            const account = await Account.findOne({
                where: {
                    username: req.body.username,
                    password: req.body.password
                }
            });
            if (account == null) {
                res.send('Account not valid! Please enter a valid account data');
            } else {
                req.session.loggedin = true;
                req.session.username = req.body.username;
                req.session.password = req.body.password;
                const account = await Account.findOne({
                    where: {
                        username: req.session.username,
                        password: req.session.password
                    }
                });
                req.session.email = account.email;
                req.session.isAdmin = account.isAdmin;
                req.session.accountId = account.id;
                return res.redirect('/posts');
            }
        }
    }

    async logout(req, res, next) {
        if (req.session) {
            req.session.destroy();
            return res.redirect('/posts');
        }
        req.session.flashMessage = 'An error occurred when trying to logout';
    }

    async register(req, res, next) {
        // Create an account
        if (req.method === 'POST') {
            await Account.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                isAdmin: 0,
                isRegistered: 1

            });
            // Then sing up with the account just created
            req.session.loggedin = true;
            req.session.username = req.body.username;
            req.session.password = req.body.password;
            return res.redirect('/posts');
        } else {
            res.render('account/register');
        }
    }
}

module.exports = AccountController;