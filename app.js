// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Initialize the Blog Post model
class Post {
  constructor() {
    // In-memory store for blog posts (simulating a database)
    this.posts = [];
    this.currentId = 1;
  }

  create(title, content) {
    const newPost = {
      id: this.currentId++,
      title: title,
      content: content,
      createdAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  getAll() {
    return this.posts;
  }

  getById(id) {
    return this.posts.find(post => post.id === parseInt(id));
  }

  update(id, title, content) {
    const post = this.getById(id);
    if (post) {
      post.title = title;
      post.content = content;
      return post;
    }
    return null;
  }

  delete(id) {
    const index = this.posts.findIndex(post => post.id === parseInt(id));
    if (index !== -1) {
      this.posts.splice(index, 1);
      return true;
    }
    return false;
  }
}

const PostModel = new Post();

// Set up Pug as the templating engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (e.g., CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse POST request data
app.use(bodyParser.urlencoded({ extended: false }));

// Display all blog posts
app.get('/', (req, res) => {
  const posts = PostModel.getAll();
  res.render('index', { posts });
});

// Display a single blog post
app.get('/post/:id', (req, res) => {
  const post = PostModel.getById(req.params.id);
  if (post) {
    res.render('show', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

// Show form to create a new post
app.get('/create', (req, res) => {
  res.render('create');
});

// Handle the form submission to create a new post
app.post('/create', (req, res) => {
  const { title, content } = req.body;
  PostModel.create(title, content);
  res.redirect('/');
});

// Show form to edit an existing post
app.get('/edit/:id', (req, res) => {
  const post = PostModel.getById(req.params.id);
  if (post) {
    res.render('edit', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

// Handle form submission to update an existing post
app.post('/edit/:id', (req, res) => {
  const { title, content } = req.body;
  const post = PostModel.update(req.params.id, title, content);
  if (post) {
    res.redirect(`/post/${post.id}`);
  } else {
    res.status(404).send('Post not found');
  }
});

// Handle deleting a post
app.get('/delete/:id', (req, res) => {
  const success = PostModel.delete(req.params.id);
  if (success) {
    res.redirect('/');
  } else {
    res.status(404).send('Post not found');
  }
});

module.exports = app;
