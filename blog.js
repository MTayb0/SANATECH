// blog.js - Complete working version

// Blog data storage
let blogPosts = [];
let mediaPreviews = [];

// Initialize blog when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog page initialized');
    
    // Load blogs from localStorage
    loadBlogs();
    
    // Hide loading screen after 1 second
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 1000);
});

// Load blogs from localStorage
function loadBlogs() {
    const saved = localStorage.getItem('sanatech_blogs');
    if (saved) {
        blogPosts = JSON.parse(saved);
    } else {
        // Default blog posts
        blogPosts = [
            {
                id: 1,
                title: 'Essential Electrical Safety Tips for Dubai Homes',
                author: 'Tayab Hussain',
                date: '2026-02-24',
                category: 'Electrical',
                content: 'Living in Dubai\'s modern homes comes with unique electrical considerations. From high-power AC units to smart home systems, ensuring your electrical setup is safe and compliant with DEWA regulations is crucial...',
                fullContent: '1. Regular Inspections are Key\nDubai\'s DEWA requires all electrical installations to meet specific standards. Schedule professional inspections every 2-3 years.\n\n2. Don\'t Overload Circuits\nWith multiple electronics running simultaneously, circuit overload is common. Use surge protectors.\n\n3. Watch for Warning Signs\nFlickering lights, warm outlets, or burning smells indicate potential problems.\n\n4. GFCI Protection is Mandatory\nIn wet areas like bathrooms and kitchens, Ground Fault Circuit Interrupters are essential.\n\n5. Child-Proof Your Outlets\nIf you have children, install tamper-resistant outlets.',
                media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800' }],
                comments: [
                    { author: 'Ahmed Al-Mansoori', date: '2026-02-25', content: 'Very informative! Thanks for sharing.' }
                ]
            },
            {
                id: 2,
                title: 'Smart Home Automation Guide for Dubai Residents',
                author: 'SanaTech Team',
                date: '2026-02-20',
                category: 'Automation',
                content: 'Transform your Dubai home into a smart oasis with the latest automation technology. From energy savings to enhanced security...',
                fullContent: 'Why Go Smart in Dubai?\nEnergy Efficiency - Smart thermostats can reduce AC costs by up to 30%\nEnhanced Security - Monitor your home from anywhere\nConvenience - Control lighting, curtains, and entertainment with voice commands',
                media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800' }],
                comments: []
            },
            {
                id: 3,
                title: '10 Essential Handyman Tips Every Dubai Homeowner Should Know',
                author: 'Tayab Hussain',
                date: '2026-02-15',
                category: 'Handyman',
                content: 'From fixing a leaky faucet to unclogging drains, these essential handyman tips will save you time and money...',
                fullContent: '1. Know Your Water Shut-Off Valve\n2. Unclog Drains Naturally\n3. Fix Squeaky Doors\n4. Patch Small Holes in Walls\n5. Maintain Your AC',
                media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c7775b4?w=800' }],
                comments: []
            }
        ];
        saveBlogs();
    }
    renderBlogs();
}

// Save blogs to localStorage
function saveBlogs() {
    localStorage.setItem('sanatech_blogs', JSON.stringify(blogPosts));
}

// Add media to preview
function addMedia() {
    const link = document.getElementById('mediaLink').value;
    if (!link) {
        alert('Please paste a media link');
        return;
    }

    mediaPreviews.push({
        type: 'image',
        url: link
    });
    
    updateMediaPreview();
    document.getElementById('mediaLink').value = '';
}

// Update media preview area
function updateMediaPreview() {
    const previewArea = document.getElementById('mediaPreview');
    if (!previewArea) return;
    
    previewArea.innerHTML = '';
    
    mediaPreviews.forEach((media, index) => {
        const item = document.createElement('div');
        item.className = 'media-preview-item';
        item.innerHTML = `<img src="${media.url}" alt="Preview">`;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-media';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => {
            mediaPreviews.splice(index, 1);
            updateMediaPreview();
        };
        
        item.appendChild(removeBtn);
        previewArea.appendChild(item);
    });
}

// Publish new blog
function publishBlog() {
    const title = document.getElementById('newBlogTitle').value;
    const category = document.getElementById('newBlogCategory').value;
    const content = document.getElementById('newBlogContent').value;

    if (!title || !content) {
        alert('Please fill in title and content');
        return;
    }

    const newPost = {
        id: Date.now(),
        title: title,
        author: 'SanaTech Team',
        date: new Date().toISOString().split('T')[0],
        category: category,
        content: content.substring(0, 150) + '...',
        fullContent: content,
        media: mediaPreviews,
        comments: []
    };

    blogPosts.unshift(newPost);
    saveBlogs();
    renderBlogs();
    
    // Clear form
    document.getElementById('newBlogTitle').value = '';
    document.getElementById('newBlogContent').value = '';
    mediaPreviews = [];
    updateMediaPreview();
    
    alert('Blog post published successfully!');
}

// Clear blog form
function clearBlogForm() {
    document.getElementById('newBlogTitle').value = '';
    document.getElementById('newBlogContent').value = '';
    mediaPreviews = [];
    updateMediaPreview();
}

// Render all blogs
function renderBlogs() {
    const blogMain = document.getElementById('blogMain');
    if (!blogMain) return;

    if (blogPosts.length === 0) {
        blogMain.innerHTML = '<div style="text-align: center; padding: 4rem; color: #8892b0;">No blog posts yet. Be the first to write one!</div>';
        return;
    }

    let html = '';
    blogPosts.forEach(post => {
        html += `
            <article class="blog-post" id="post-${post.id}">
                <div class="blog-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                    <span><i class="fas fa-folder"></i> ${post.category}</span>
                </div>
                <h2 class="blog-title">${post.title}</h2>
                
                ${renderMedia(post.media)}
                
                <div class="blog-content">
                    <p>${post.content}</p>
                </div>
                
                <a class="read-more" onclick="togglePost(${post.id})">
                    Read Full Article <i class="fas fa-arrow-right"></i>
                </a>
                
                <div id="full-${post.id}" style="display: none;" class="full-post">
                    ${post.fullContent.replace(/\n/g, '<br>')}
                </div>
                
                <!-- Comments Section -->
                <div class="comments-section">
                    <h3 class="comments-title"><i class="fas fa-comments"></i> Comments (${post.comments.length})</h3>
                    
                    <div id="comments-${post.id}">
                        ${renderComments(post.comments)}
                    </div>
                    
                    <!-- Comment Form -->
                    <div class="comment-form">
                        <h3>Leave a Comment</h3>
                        <input type="text" id="comment-name-${post.id}" placeholder="Your Name *">
                        <input type="email" id="comment-email-${post.id}" placeholder="Your Email *">
                        <textarea id="comment-content-${post.id}" rows="3" placeholder="Your Comment *"></textarea>
                        <button onclick="submitComment(${post.id})"><i class="fas fa-paper-plane"></i> Post Comment</button>
                    </div>
                </div>
            </article>
        `;
    });
    
    blogMain.innerHTML = html;
}

// Render media
function renderMedia(media) {
    if (!media || media.length === 0) return '';
    
    let html = '';
    media.forEach(item => {
        html += `<div class="media-container"><img src="${item.url}" alt="Blog image" loading="lazy"></div>`;
    });
    return html;
}

// Render comments
function renderComments(comments) {
    if (comments.length === 0) {
        return '<p style="color: #8892b0;">No comments yet. Be the first to comment!</p>';
    }
    
    let html = '';
    comments.forEach(comment => {
        html += `
            <div class="comment">
                <div class="comment-meta">
                    <span class="comment-author"><i class="fas fa-user-circle"></i> ${comment.author}</span>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `;
    });
    return html;
}

// Toggle post full content
function togglePost(postId) {
    const fullPost = document.getElementById(`full-${postId}`);
    if (fullPost.style.display === 'none') {
        fullPost.style.display = 'block';
    } else {
        fullPost.style.display = 'none';
    }
}

// Submit comment
function submitComment(postId) {
    const name = document.getElementById(`comment-name-${postId}`).value;
    const email = document.getElementById(`comment-email-${postId}`).value;
    const content = document.getElementById(`comment-content-${postId}`).value;

    if (!name || !email || !content) {
        alert('Please fill in all required fields');
        return;
    }

    const post = blogPosts.find(p => p.id === postId);
    if (post) {
        post.comments.push({
            author: name,
            email: email,
            content: content,
            date: new Date().toISOString().split('T')[0]
        });
        
        saveBlogs();
        
        // Refresh comments
        const commentsDiv = document.getElementById(`comments-${postId}`);
        commentsDiv.innerHTML = renderComments(post.comments);
        
        // Clear form
        document.getElementById(`comment-name-${postId}`).value = '';
        document.getElementById(`comment-email-${postId}`).value = '';
        document.getElementById(`comment-content-${postId}`).value = '';
        
        alert('Comment posted successfully!');
    }
}

// Format date
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

// Search blogs
function searchBlog() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) {
        renderBlogs();
        return;
    }
    
    const filtered = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
    );
    
    const blogMain = document.getElementById('blogMain');
    if (filtered.length === 0) {
        blogMain.innerHTML = '<div style="text-align: center; padding: 4rem; color: #8892b0;">No posts found matching your search.</div>';
    } else {
        // Temporarily replace blogPosts with filtered for rendering
        const allPosts = blogPosts;
        blogPosts = filtered;
        renderBlogs();
        blogPosts = allPosts;
    }
}

// Filter by category
function filterByCategory(category) {
    if (category === 'all') {
        renderBlogs();
    } else {
        const filtered = blogPosts.filter(p => p.category === category);
        const blogMain = document.getElementById('blogMain');
        if (filtered.length === 0) {
            blogMain.innerHTML = '<div style="text-align: center; padding: 4rem; color: #8892b0;">No posts in this category.</div>';
        } else {
            // Temporarily replace blogPosts with filtered for rendering
            const allPosts = blogPosts;
            blogPosts = filtered;
            renderBlogs();
            blogPosts = allPosts;
        }
    }
}

// Subscribe to blog
function subscribeBlog() {
    const email = document.getElementById('subscribeEmail').value;
    if (!email) {
        alert('Please enter your email');
        return;
    }
    
    let subscribers = JSON.parse(localStorage.getItem('blog_subscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('blog_subscribers', JSON.stringify(subscribers));
        alert('Thank you for subscribing!');
    } else {
        alert('You are already subscribed!');
    }
    document.getElementById('subscribeEmail').value = '';
}
