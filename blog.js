// blog.js - Enhanced for PDF content

// Blog data storage
let blogPosts = [];
let mediaPreviews = [];

// PDF Template - Use this to add your PDF content as blog posts
const pdfBlogTemplate = {
    // Copy your PDF content here as blog posts
    // Example:
    electricalGuide: {
        title: "Complete Electrical Guide for Dubai Homes",
        content: `Your PDF text content here...
        
        You can paste multiple paragraphs.
        
        The system will format it nicely.`,
        images: [
            "https://i.imgur.com/your-image-1.jpg",
            "https://i.imgur.com/your-image-2.jpg",
            "https://i.imgur.com/your-image-3.jpg"
        ]
    }
};

// Initialize blog
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog page initialized');
    loadBlogs();
    
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.style.display = 'none';
    }, 1000);
});

// Quick Add PDF Content Function
function addPDFContent() {
    // This is where you'll paste your PDF content
    const pdfContent = {
        title: "Your PDF Title Here",
        category: "Electrical", // or Automation, Handyman, Tiles
        content: `Paste your PDF text here. 
        
        You can have multiple paragraphs.
        
        Just copy and paste from your PDF.`,
        
        // Add image links you uploaded to Imgur
        imageLinks: [
            "https://i.imgur.com/your-image-1.jpg",
            "https://i.imgur.com/your-image-2.jpg",
            "https://i.imgur.com/your-image-3.jpg"
        ]
    };
    
    // This will create a blog post from your PDF
    createPDFBlogPost(pdfContent);
}

// Create blog post from PDF content
function createPDFBlogPost(pdfData) {
    const mediaArray = pdfData.imageLinks.map(link => ({
        type: 'image',
        url: link
    }));

    const newPost = {
        id: Date.now(),
        title: pdfData.title,
        author: 'SanaTech Expert',
        date: new Date().toISOString().split('T')[0],
        category: pdfData.category,
        content: pdfData.content.substring(0, 200) + '...',
        fullContent: pdfData.content,
        media: mediaArray,
        comments: []
    };

    blogPosts.unshift(newPost);
    saveBlogs();
    renderBlogs();
    alert('PDF content added as blog post!');
}

// Load blogs
function loadBlogs() {
    const saved = localStorage.getItem('sanatech_blogs');
    if (saved) {
        blogPosts = JSON.parse(saved);
    } else {
        // Default blogs with your PDF content
        blogPosts = [
            {
                id: 1,
                title: 'Complete Electrical Installation Guide - Dubai Standards',
                author: 'Tayab Hussain',
                date: '2026-02-24',
                category: 'Electrical',
                content: 'Comprehensive guide to electrical installations following DEWA regulations...',
                fullContent: `# Electrical Installation Guide for Dubai

## 1. DEWA Approval Process
All electrical work in Dubai must be approved by DEWA. Here's how to get approval...

## 2. Wiring Standards
Use only DEWA-approved cables and materials...

## 3. Safety Requirements
GFCI protection, proper grounding, and circuit breaker requirements...

## 4. Inspection Checklist
- Verify all wiring meets specifications
- Test all circuits
- Check grounding systems
- Document everything for DEWA`,
                media: [
                    { type: 'image', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800' },
                    { type: 'image', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800' }
                ],
                comments: []
            }
        ];
        saveBlogs();
    }
    renderBlogs();
}

// Enhanced media renderer with gallery view
function renderMedia(media) {
    if (!media || media.length === 0) return '';
    
    if (media.length === 1) {
        return `<div class="media-container"><img src="${media[0].url}" alt="Blog image" loading="lazy"></div>`;
    }
    
    // Create image gallery for multiple images
    let galleryHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 1.5rem 0;">';
    
    media.forEach(item => {
        galleryHtml += `
            <div style="border-radius: 10px; overflow: hidden; border: 2px solid rgba(0,255,255,0.3); cursor: pointer;" onclick="openImageGallery('${item.url}')">
                <img src="${item.url}" alt="Gallery image" style="width: 100%; height: 200px; object-fit: cover;">
            </div>
        `;
    });
    
    galleryHtml += '</div>';
    return galleryHtml;
}

// Open image in lightbox
function openImageGallery(imageUrl) {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    lightbox.innerHTML = `
        <img src="${imageUrl}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
        <button style="position: absolute; top: 20px; right: 20px; background: red; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 20px; cursor: pointer;">×</button>
    `;
    
    lightbox.onclick = () => document.body.removeChild(lightbox);
    document.body.appendChild(lightbox);
}

// Save blogs
function saveBlogs() {
    localStorage.setItem('sanatech_blogs', JSON.stringify(blogPosts));
}

// Add media
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

// Update media preview
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

// Publish blog
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
    
    document.getElementById('newBlogTitle').value = '';
    document.getElementById('newBlogContent').value = '';
    mediaPreviews = [];
    updateMediaPreview();
    
    alert('Blog post published successfully!');
}

// Render blogs
function renderBlogs() {
    const blogMain = document.getElementById('blogMain');
    if (!blogMain) return;

    if (blogPosts.length === 0) {
        blogMain.innerHTML = '<div style="text-align: center; padding: 4rem;">No blog posts yet.</div>';
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
                
                <div class="comments-section">
                    <h3 class="comments-title"><i class="fas fa-comments"></i> Comments (${post.comments.length})</h3>
                    <div id="comments-${post.id}">
                        ${renderComments(post.comments)}
                    </div>
                    
                    <div class="comment-form">
                        <h3>Leave a Comment</h3>
                        <input type="text" id="comment-name-${post.id}" placeholder="Your Name *">
                        <input type="email" id="comment-email-${post.id}" placeholder="Your Email *">
                        <textarea id="comment-content-${post.id}" rows="3" placeholder="Your Comment *"></textarea>
                        <button onclick="submitComment(${post.id})">Post Comment</button>
                    </div>
                </div>
            </article>
        `;
    });
    
    blogMain.innerHTML = html;
}

// Rest of the functions (togglePost, submitComment, formatDate, etc.)
function togglePost(postId) {
    const fullPost = document.getElementById(`full-${postId}`);
    fullPost.style.display = fullPost.style.display === 'none' ? 'block' : 'none';
}

function submitComment(postId) {
    const name = document.getElementById(`comment-name-${postId}`).value;
    const email = document.getElementById(`comment-email-${postId}`).value;
    const content = document.getElementById(`comment-content-${postId}`).value;

    if (!name || !email || !content) {
        alert('Please fill all fields');
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
        document.getElementById(`comments-${postId}`).innerHTML = renderComments(post.comments);
        
        document.getElementById(`comment-name-${postId}`).value = '';
        document.getElementById(`comment-email-${postId}`).value = '';
        document.getElementById(`comment-content-${postId}`).value = '';
    }
}

function renderComments(comments) {
    if (comments.length === 0) return '<p>No comments yet.</p>';
    
    return comments.map(c => `
        <div class="comment">
            <div class="comment-meta">
                <span class="comment-author">${c.author}</span>
                <span class="comment-date">${formatDate(c.date)}</span>
            </div>
            <div class="comment-content">${c.content}</div>
        </div>
    `).join('');
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function clearBlogForm() {
    document.getElementById('newBlogTitle').value = '';
    document.getElementById('newBlogContent').value = '';
    mediaPreviews = [];
    updateMediaPreview();
}

function searchBlog() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    if (!term) {
        renderBlogs();
        return;
    }
    
    const filtered = blogPosts.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.content.toLowerCase().includes(term)
    );
    
    const allPosts = blogPosts;
    blogPosts = filtered;
    renderBlogs();
    blogPosts = allPosts;
}

function filterByCategory(category) {
    if (category === 'all') {
        renderBlogs();
    } else {
        const filtered = blogPosts.filter(p => p.category === category);
        const allPosts = blogPosts;
        blogPosts = filtered;
        renderBlogs();
        blogPosts = allPosts;
    }
}

function subscribeBlog() {
    const email = document.getElementById('subscribeEmail').value;
    if (!email) {
        alert('Enter email');
        return;
    }
    alert('Subscribed! Check your email.');
    document.getElementById('subscribeEmail').value = '';
}
