// models/post.js
class Post {
    constructor() {
        // In-memory store for blog posts (simulating a database)
        this.posts = [];
        this.currentId = 1;
    }

    // Create a new post
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

    // Get all posts
    getAll() {
        return this.posts;
    }

    // Get a single post by ID
    getById(id) {
        return this.posts.find(post => post.id === parseInt(id));
    }

    // Update a post by ID
    update(id, title, content) {
        const post = this.getById(id);
        if (post) {
            post.title = title;
            post.content = content;
            return post;
        }
        return null;
    }

    // Delete a post by ID
    delete(id) {
        const index = this.posts.findIndex(post => post.id === parseInt(id));
        if (index !== -1) {
            this.posts.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = new Post();
