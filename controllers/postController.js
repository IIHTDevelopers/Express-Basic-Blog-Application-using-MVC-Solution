// controllers/postController.js
const Post = require('../models/post');

exports.index = (req, res) => {
    const posts = Post.getAll();
    res.render('index', { posts });
};

exports.show = (req, res) => {
    const post = Post.getById(req.params.id);
    if (post) {
        res.render('show', { post });
    } else {
        res.status(404).send('Post not found');
    }
};

exports.createForm = (req, res) => {
    res.render('create');
};

exports.create = (req, res) => {
    const { title, content } = req.body;
    Post.create(title, content);
    res.redirect('/');
};

exports.editForm = (req, res) => {
    const post = Post.getById(req.params.id);
    if (post) {
        res.render('edit', { post });
    } else {
        res.status(404).send('Post not found');
    }
};

exports.edit = (req, res) => {
    const { title, content } = req.body;
    const post = Post.update(req.params.id, title, content);
    if (post) {
        res.redirect(`/post/${post.id}`);
    } else {
        res.status(404).send('Post not found');
    }
};

exports.delete = (req, res) => {
    const success = Post.delete(req.params.id);
    if (success) {
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
};
