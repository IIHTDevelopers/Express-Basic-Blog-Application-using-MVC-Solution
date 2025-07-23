// tests/app.test.js

const request = require('supertest');
const app = require('../app');  // Import the app.js module that contains the Express app

let appBoundaryTest = `AppController boundary test`;

describe('App Controller', () => {
    describe('boundary', () => {
        // Test for the root route ("/") - List of blog posts
        it(`${appBoundaryTest} should return a 200 status and render the list of posts`, async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.text).toContain('Blog Posts');  // Ensure the page contains the title
        });

        // Test for the /post/:id route - Display a single post
        it(`${appBoundaryTest} should return a 200 status and render a single post`, async () => {
            // First, create a post to test
            await request(app)
                .post('/create')
                .send({ title: 'Test Post', content: 'This is a test post' });

            const response = await request(app).get('/post/1');
            
            expect(response.status).toBe(200);
        });

        // Test for the /create route - Show the create post form
        it(`${appBoundaryTest} should return a 200 status for the create post form`, async () => {
            const response = await request(app).get('/create');
            expect(response.status).toBe(200);
            expect(response.text).toContain('<h1>Create a New Post');  // Ensure the create page is displayed
        });

        // Test for the /create route - Handle form submission to create a new post
        it(`${appBoundaryTest} should create a new post and redirect to the homepage`, async () => {
            const response = await request(app)
                .post('/create')
                .send({ title: 'New Test Post', content: 'This is another test post' });
            expect(response.status).toBe(302);  // Should redirect
            expect(response.headers.location).toBe('/');  // Redirect to homepage
        });

        // Test for the /edit/:id route - Show the edit post form
        it(`${appBoundaryTest} should return a 200 status for the edit post form`, async () => {
            // Create a post to test editing
            await request(app)
                .post('/create')
                .send({ title: 'Post to Edit', content: 'Original content' });

            const response = await request(app).get('/edit/1');
            expect(response.status).toBe(200);
            expect(response.text).toContain('Edit Post');  // Ensure the edit page is displayed
        });

        // Test for the /edit/:id route - Handle form submission to update an existing post
        it(`${appBoundaryTest} should update an existing post and redirect to the updated post`, async () => {
            // Create a post to edit
            await request(app)
                .post('/create')
                .send({ title: 'Post to Update', content: 'Original content' });

            const response = await request(app)
                .post('/edit/1')
                .send({ title: 'Updated Post Title', content: 'Updated content' });

            expect(response.status).toBe(302);  // Should redirect
            expect(response.headers.location).toBe('/post/1');  // Redirect to the updated post
        });

        // Test for the /delete/:id route - Handle deleting a post
        it(`${appBoundaryTest} should delete a post and redirect to the homepage`, async () => {
            // Create a post to delete
            await request(app)
                .post('/create')
                .send({ title: 'Post to Delete', content: 'This post will be deleted' });

            const response = await request(app).get('/delete/1');
            expect(response.status).toBe(302);  // Should redirect after deletion
            expect(response.headers.location).toBe('/');  // Redirect to homepage
        });

        // Test for invalid post ID - 404 error when viewing a post
        it(`${appBoundaryTest} should return a 404 for invalid post ID`, async () => {
            const response = await request(app).get('/post/999');  // Non-existent post ID
            expect(response.status).toBe(404);
            expect(response.text).toContain('Post not found');  // Ensure error message is displayed
        });

        // Test for invalid post ID - 404 error when editing a post
        it(`${appBoundaryTest} should return a 404 for invalid post ID when editing`, async () => {
            const response = await request(app).get('/edit/999');  // Non-existent post ID
            expect(response.status).toBe(404);
            expect(response.text).toContain('Post not found');  // Ensure error message is displayed
        });

        // Test for invalid post ID - 404 error when deleting a post
        it(`${appBoundaryTest} should return a 404 for invalid post ID when deleting`, async () => {
            const response = await request(app).get('/delete/999');  // Non-existent post ID
            expect(response.status).toBe(404);
            expect(response.text).toContain('Post not found');  // Ensure error message is displayed
        });
    });
});
