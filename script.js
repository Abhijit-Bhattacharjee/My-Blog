// Animation and Interactive Effects Class
class AnimationEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupTypingEffect();
    this.setupHoverEffects();
    this.setupParticleEffects();
    this.setupCardIndexAnimations();
    this.setupScrollToTop();
    this.setupButtonLoading();
    this.setupCardHoverEffects();
    this.setupParallaxEffect();
  }

  // Setup scroll-triggered animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
      observer.observe(el);
    });
  }

  // Typing effect for the main heading
  setupTypingEffect() {
    const heading = document.querySelector('.header-content h1');
    if (heading) {
      const text = heading.textContent;
      heading.textContent = '';
      heading.classList.add('typing-effect');

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          heading.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        } else {
          heading.classList.remove('typing-effect');
        }
      };

      // Start typing after a delay
      setTimeout(typeWriter, 1000);
    }
  }

  // Enhanced hover effects
  setupHoverEffects() {
    // Add hover-lift class to interactive elements
    document.querySelectorAll('.post-card, .btn, .nav-btn').forEach(el => {
      el.classList.add('hover-lift');
    });

    // Magnetic effect for buttons
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // Floating particle effects
  setupParticleEffects() {
    this.createParticles();
  }

  createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floating ${Math.random() * 10 + 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 10}s;
      `;
      particleContainer.appendChild(particle);
    }

    document.body.appendChild(particleContainer);
  }

  // Add index-based animation delays to cards
  setupCardIndexAnimations() {
    const cards = document.querySelectorAll('.post-card');
    cards.forEach((card, index) => {
      card.style.setProperty('--card-index', index);
    });
  }

  // Setup scroll-to-top button
  setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollBtn.style.display = 'flex';
        scrollBtn.classList.add('fade-in-up');
      } else {
        scrollBtn.style.display = 'none';
        scrollBtn.classList.remove('fade-in-up');
      }
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Add loading animation for buttons
  setupButtonLoading() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
          this.classList.add('loading');
          this.innerHTML = '<span class="spinner-small"></span> Loading...';

          setTimeout(() => {
            this.classList.remove('loading');
            this.innerHTML = this.textContent;
          }, 2000);
        }
      });
    });
  }

  // Enhanced card hover effects
  setupCardHoverEffects() {
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.post-card')) {
        const card = e.target.closest('.post-card');
        card.style.transform = 'translateY(-10px) scale(1.02) rotateX(5deg)';
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('.post-card')) {
        const card = e.target.closest('.post-card');
        card.style.transform = '';
      }
    });
  }

  // Smooth reveal animations for dynamic content
  animateNewContent() {
    const newElements = document.querySelectorAll('.post-card:not(.animated)');
    newElements.forEach((el, index) => {
      el.classList.add('fade-in-up', 'animated');
      el.style.animationDelay = `${index * 0.1}s`;
      setTimeout(() => el.classList.add('animate'), 100);
    });
  }

  // Setup parallax effect
  setupParallaxEffect() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      document.body.style.backgroundPosition = `center ${rate}px`;
    });
  }
}

// Enhanced BlogApp with animations
class BlogApp {
  constructor() {
    this.currentPage = 1;
    this.totalPages = 1;
    this.editingPostId = null;
    this.deletePostId = null;
    this.postsPerPage = 5;
    this.animationEffects = new AnimationEffects();

    this.initializeEventListeners();
    this.loadPosts();
  }

  // Override displayPosts to include animations
  displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    const emptyState = document.getElementById('emptyState');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (posts.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
      welcomeMessage.style.display = 'block';
      document.getElementById('totalPosts').textContent = '0';
      return;
    }

    emptyState.style.display = 'none';
    welcomeMessage.style.display = 'none';

    container.innerHTML = posts.map((post, index) => `
      <article class="post-card fade-in-up" data-post-id="${post.id}" style="--card-index: ${index}">
        <div class="post-header">
          <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
          <time class="post-date">${this.formatDate(post.date_created)}</time>
        </div>
        <p class="post-author">By <strong>${this.escapeHtml(post.author)}</strong></p>
        <p class="post-excerpt">${this.escapeHtml(post.content.substring(0, 150))}...</p>
        <div class="post-actions">
          <button class="btn btn-small btn-primary" onclick="blogApp.showFormSection(${post.id})">Edit</button>
          <button class="btn btn-small btn-danger" onclick="blogApp.openDeleteModal(${post.id})">Delete</button>
        </div>
      </article>
    `).join('');

    // Trigger animations for new content
    this.animationEffects.animateNewContent();
  }

  // Initialize all event listeners
  initializeEventListeners() {
    // Navigation buttons
    document.getElementById('homeBtn').addEventListener('click', () => this.showHomeSection());
    document.getElementById('viewPostsBtn').addEventListener('click', () => this.showPostsSection());
    document.getElementById('createPostBtn').addEventListener('click', () => this.showFormSection());
    document.getElementById('aboutBtn').addEventListener('click', () => this.showAboutSection());
    document.getElementById('howItWorksBtn').addEventListener('click', () => this.showHowItWorksSection());

    // Theme Toggle
    document.getElementById('themeToggleBtn').addEventListener('click', () => this.toggleTheme());

    // Form handling
    document.getElementById('postForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
    document.getElementById('cancelBtn').addEventListener('click', () => this.resetForm());

    // Character counters
    document.getElementById('postTitle').addEventListener('input', (e) => {
      document.getElementById('titleCount').textContent = e.target.value.length;
    });

    document.getElementById('postContent').addEventListener('input', (e) => {
      document.getElementById('contentCount').textContent = e.target.value.length;
    });

    // Pagination
    document.getElementById('prevBtn').addEventListener('click', () => this.previousPage());
    document.getElementById('nextBtn').addEventListener('click', () => this.nextPage());

    // Delete modal
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.closeDeleteModal());
    document.getElementById('modalOverlay').addEventListener('click', () => this.closeDeleteModal());
  }

  toggleTheme() {
    const themes = ['default', 'dark', 'sunset'];
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'default';
    let nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    let nextTheme = themes[nextIndex];
    
    if (nextTheme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }

    // Add a quick visual pop to the button
    const btn = document.getElementById('themeToggleBtn');
    btn.style.transform = 'scale(1.2) rotate(180deg)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 300);
  }

  hideAllSections() {
    const sections = ['homeSection', 'postsSection', 'postFormSection', 'aboutSection', 'howItWorksSection'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  }

  showHomeSection() {
    this.hideAllSections();
    document.getElementById('homeSection').classList.remove('hidden');
    document.getElementById('homeBtn').classList.add('active');
  }

  showAboutSection() {
    this.hideAllSections();
    document.getElementById('aboutSection').classList.remove('hidden');
    document.getElementById('aboutBtn').classList.add('active');
  }

  showHowItWorksSection() {
    this.hideAllSections();
    document.getElementById('howItWorksSection').classList.remove('hidden');
    document.getElementById('howItWorksBtn').classList.add('active');
  }

  // Show posts section
  showPostsSection() {
    this.hideAllSections();
    document.getElementById('postsSection').classList.remove('hidden');
    document.getElementById('viewPostsBtn').classList.add('active');
    this.loadPosts();
  }

  // Show form section
  showFormSection(postId = null) {
    this.hideAllSections();
    document.getElementById('postFormSection').classList.remove('hidden');
    document.getElementById('createPostBtn').classList.add('active');

    if (postId) {
      this.loadPostForEditing(postId);
    } else {
      this.resetForm();
    }
  }

  // Load posts from server
  async loadPosts(page = 1) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'flex';

    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${this.postsPerPage}`);
      const result = await response.json();

      if (result.success) {
        this.displayPosts(result.data);
        this.updatePagination(result.pagination);
        this.currentPage = page;
      } else {
        this.showError('Failed to load posts');
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      this.showError('Error loading posts. Please try again.');
    } finally {
      loadingSpinner.style.display = 'none';
    }
  }

  // Display posts in the UI
  displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    const emptyState = document.getElementById('emptyState');

    if (posts.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
      document.getElementById('totalPosts').textContent = '0';
      return;
    }

    emptyState.style.display = 'none';

    container.innerHTML = posts.map(post => `
      <article class="post-card" data-post-id="${post.id}">
        <div class="post-header">
          <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
          <time class="post-date">${this.formatDate(post.date_created)}</time>
        </div>
        <p class="post-author">By <strong>${this.escapeHtml(post.author)}</strong></p>
        <p class="post-excerpt">${this.escapeHtml(post.content.substring(0, 150))}...</p>
        <div class="post-actions">
          <button class="btn btn-small btn-primary" onclick="blogApp.showFormSection(${post.id})">Edit</button>
          <button class="btn btn-small btn-danger" onclick="blogApp.openDeleteModal(${post.id})">Delete</button>
        </div>
      </article>
    `).join('');
  }

  // Update pagination controls
  updatePagination(pagination) {
    this.totalPages = pagination.pages;
    document.getElementById('currentPage').textContent = pagination.page;
    document.getElementById('totalPages').textContent = pagination.pages;
    document.getElementById('totalPosts').textContent = pagination.total;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationContainer = document.getElementById('paginationContainer');

    if (pagination.pages > 1) {
      paginationContainer.style.display = 'flex';
      prevBtn.disabled = pagination.page === 1;
      nextBtn.disabled = pagination.page === pagination.pages;
    } else {
      paginationContainer.style.display = 'none';
    }
  }

  // Pagination handlers
  previousPage() {
    if (this.currentPage > 1) {
      this.loadPosts(this.currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadPosts(this.currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Load post for editing
  async loadPostForEditing(postId) {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const result = await response.json();

      if (result.success) {
        const post = result.data;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postAuthor').value = post.author;
        document.getElementById('postContent').value = post.content;
        document.getElementById('titleCount').textContent = post.title.length;
        document.getElementById('contentCount').textContent = post.content.length;
        document.getElementById('formTitle').textContent = 'Edit Blog Post';
        document.getElementById('submitBtnText').textContent = 'Update Post';
        this.editingPostId = postId;
      }
    } catch (error) {
      console.error('Error loading post:', error);
      this.showError('Failed to load post for editing');
    }
  }

  // Handle form submission
  async handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value;
    const author = document.getElementById('postAuthor').value;
    const content = document.getElementById('postContent').value;

    // Clear previous errors
    const errorDiv = document.getElementById('formErrors');
    errorDiv.style.display = 'none';
    errorDiv.innerHTML = '';

    try {
      const method = this.editingPostId ? 'PUT' : 'POST';
      const url = this.editingPostId 
        ? `/api/posts/${this.editingPostId}` 
        : '/api/posts';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, content })
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccessMessage(
          this.editingPostId ? 'Post updated successfully!' : 'Post created successfully!'
        );
        this.resetForm();
        setTimeout(() => {
          this.showPostsSection();
        }, 1500);
      } else {
        if (result.errors && Array.isArray(result.errors)) {
          this.displayFormErrors(result.errors);
        } else {
          this.showError(result.error || 'An error occurred');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      this.showError('Failed to save post. Please try again.');
    }
  }

  // Display form validation errors
  displayFormErrors(errors) {
    const errorDiv = document.getElementById('formErrors');
    errorDiv.innerHTML = errors.map(error => `<p>❌ ${error}</p>`).join('');
    errorDiv.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Reset form
  resetForm() {
    document.getElementById('postForm').reset();
    document.getElementById('postTitle').value = '';
    document.getElementById('postAuthor').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('titleCount').textContent = '0';
    document.getElementById('contentCount').textContent = '0';
    document.getElementById('formTitle').textContent = 'Create New Blog Post';
    document.getElementById('submitBtnText').textContent = 'Publish Post';
    document.getElementById('formErrors').style.display = 'none';
    this.editingPostId = null;
  }

  // Delete post handlers
  openDeleteModal(postId) {
    this.deletePostId = postId;
    document.getElementById('deleteModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
  }

  closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
    this.deletePostId = null;
  }

  async confirmDelete() {
    if (!this.deletePostId) return;

    try {
      const response = await fetch(`/api/posts/${this.deletePostId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccessMessage('Post deleted successfully!');
        this.closeDeleteModal();
        setTimeout(() => {
          this.loadPosts(1);
          this.currentPage = 1;
        }, 1500);
      } else {
        this.showError(result.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      this.showError('Failed to delete post. Please try again.');
    }
  }

  // Utility functions
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `<span>✅ ${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `<span>❌ ${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }
}

// Initialize the app when DOM is ready
let blogApp;
document.addEventListener('DOMContentLoaded', () => {
  blogApp = new BlogApp();
});
