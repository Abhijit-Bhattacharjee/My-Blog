const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3010;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Database setup
const dbPath = path.join(__dirname, 'blog.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database
function initializeDatabase() {
  const sqlPath = path.join(__dirname, 'database.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  db.exec(sql, (err) => {
    if (err) {
      console.error('Database initialization error:', err);
    } else {
      console.log('Database initialized successfully');
    }
  });
}

// Utility function for database operations
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Validation helper
function validateBlogPost(title, content, author) {
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.trim().length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  if (!content || content.trim().length === 0) {
    errors.push('Content is required');
  } else if (content.trim().length < 10) {
    errors.push('Content must be at least 10 characters');
  }
  
  if (!author || author.trim().length === 0) {
    errors.push('Author is required');
  } else if (author.trim().length > 100) {
    errors.push('Author name must be less than 100 characters');
  }
  
  return errors;
}

// API Endpoints

// Get all posts with pagination
app.get('/api/posts', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(10, parseInt(req.query.limit) || 5);
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await dbGet('SELECT COUNT(*) as total FROM blog_posts');
    const total = countResult.total;

    // Get posts for current page
    const posts = await dbAll(
      'SELECT * FROM blog_posts ORDER BY date_created DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});

// Get single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await dbGet('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
});

// Create new post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    // Validate input
    const errors = validateBlogPost(title, content, author);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await dbRun(
      'INSERT INTO blog_posts (title, content, author, date_created, date_updated) VALUES (?, ?, ?, datetime("now"), datetime("now"))',
      [title.trim(), content.trim(), author.trim()]
    );

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { id: result.id }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, error: 'Failed to create post' });
  }
});

// Update post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const postId = req.params.id;

    // Check if post exists
    const post = await dbGet('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Validate input
    const errors = validateBlogPost(title, content, author);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    await dbRun(
      'UPDATE blog_posts SET title = ?, content = ?, author = ?, date_updated = datetime("now") WHERE id = ?',
      [title.trim(), content.trim(), author.trim(), postId]
    );

    res.json({
      success: true,
      message: 'Post updated successfully'
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ success: false, error: 'Failed to update post' });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if post exists
    const post = await dbGet('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    await dbRun('DELETE FROM blog_posts WHERE id = ?', [postId]);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, error: 'Failed to delete post' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Blog server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
