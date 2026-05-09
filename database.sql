-- Create Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_date_created ON blog_posts(date_created DESC);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, author, date_created) VALUES
('Welcome to Our Blog', 'This is our first blog post. We are excited to share our thoughts and ideas with you!', 'Admin', datetime('now', '-7 days')),
('Getting Started with Web Development', 'Web development is an exciting field with endless possibilities. In this post, we explore the basics of HTML, CSS, and JavaScript.', 'John Doe', datetime('now', '-5 days')),
('Best Practices for Database Design', 'Designing an efficient database is crucial for any application. Learn about normalization, indexing, and query optimization.', 'Jane Smith', datetime('now', '-3 days'));
