const Tag = require('../models').Tag;
const Post = require('../models').Post;


class TagController {
    async showPostsWithTag(req, res, next) {
        let isAdmin = false;
        let isRegistered = false;
        
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
            isAdmin = true;
            isRegistered = true;
            return res.render('tags/tagsList', { title: 'Posts with this Tag', posts: posts, isAdmin: isAdmin, isRegistered: isRegistered });
        } else if(req.session.loggedin == true) {
            isAdmin = false;
            isRegistered = true;
            return res.render('tags/tagsList', { title: 'Posts with this Tag', posts: posts, isAdmin: isAdmin, isRegistered: isRegistered });
        } else {
            return res.render('tags/tagsList', { title: 'Posts with this Tag', posts: posts, isAdmin: isAdmin, isRegistered: isRegistered });
        }
    }
}

module.exports = TagController;

