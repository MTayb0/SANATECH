// blog.js - Complete Blog System

// ==================== CONFIGURATION ====================
const ADMIN_EMAIL = 'tayab.elec@gmail.com';
const ADMIN_VILLAGE = 'Goralla86gb'; // CHANGE THIS to your village + number

// ==================== DATA STRUCTURE ====================
let blogPosts = [];
let currentUser = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog system initializing...');
    
    // Load data
    loadPosts();
    checkSavedUser();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 1000);
    
    // Check URL for post ID
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    if (postId) {
        setTimeout(() => {
            scrollToPost(postId);
        }, 1500);
    }
});
// ==================== USER MANAGEMENT ====================
function switchLoginTab(tab) {
    document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
    if (tab === 'login') {
        document.querySelector('.login-tab').classList.add('active');
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('adminRecovery').style.display = 'none';
    } else {
        document.querySelectorAll('.login-tab')[1].classList.add('active');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.getElementById('adminRecovery').style.display = 'block';
    }
}

function loginUser() {
    const name = document.getElementById('loginName').value.trim();
    const email = document.getElementById('loginEmail').value.trim();
    
    if (!name || !email) {
        alert('Please enter name and email');
        return;
    }
    
    currentUser = {
        name: name,
        email: email,
        isAdmin: email === ADMIN_EMAIL
    };
    
    localStorage.setItem('blog_user', JSON.stringify(currentUser));
    
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('writeSection').classList.add('visible');
    
    if (currentUser.isAdmin) {
        document.getElementById('adminRecovery').style.display = 'none';
    }
    
    renderPosts();
    alert(`Welcome ${name}! ${currentUser.isAdmin ? '(Admin)' : ''}`);
}

function registerUser() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const security = document.getElementById('regSecurity').value.trim();
    
    if (!name || !email) {
        alert('Please enter name and email');
        return;
    }
    
    // Check if this is admin registration
    if (email === ADMIN_EMAIL) {
        if (security !== ADMIN_VILLAGE) {
            alert('Incorrect security answer for admin registration');
            return;
        }
    }
    
    currentUser = {
        name: name,
        email: email,
        isAdmin: email === ADMIN_EMAIL
    };
    
    localStorage.setItem('blog_user', JSON.stringify(currentUser));
    
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('writeSection').classList.add('visible');
    
    renderPosts();
    alert(`Welcome ${name}! ${currentUser.isAdmin ? '(Admin)' : ''}`);
}

function recoverAdmin() {
    const answer = document.getElementById('recoveryAnswer').value.trim();
    if (answer === ADMIN_VILLAGE) {
        currentUser = {
            name: 'Admin',
            email: ADMIN_EMAIL,
            isAdmin: true
        };
        localStorage.setItem('blog_user', JSON.stringify(currentUser));
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('writeSection').classList.add('visible');
        renderPosts();
        alert('Admin access recovered!');
    } else {
        alert('Incorrect answer');
    }
}

function checkSavedUser() {
    const saved = localStorage.getItem('blog_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('writeSection').classList.add('visible');
        renderPosts();
    }
}

function logout() {
    if (confirm('Logout?')) {
        currentUser = null;
        localStorage.removeItem('blog_user');
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('writeSection').classList.remove('visible');
        renderPosts();
    }
}

// Add logout button to navbar
function addLogoutButton() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !document.getElementById('logoutBtn')) {
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.id = 'logoutBtn';
        logoutBtn.className = 'nav-link';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            logout();
        };
        navMenu.appendChild(logoutBtn);
    }
}

// Call this after login
setTimeout(addLogoutButton, 1000);
// ==================== POST MANAGEMENT ====================
function loadPosts() {
    const saved = localStorage.getItem('blog_posts');
    if (saved) {
        blogPosts = JSON.parse(saved);
    } else {
        // Sample posts
        blogPosts = [
            {
                id: Date.now() - 86400000,
                title: 'Essential Electrical Safety Tips for Dubai Homes',
                author: 'Tayab Hussain',
                authorEmail: ADMIN_EMAIL,
                date: new Date(Date.now() - 86400000).toISOString(),
                category: 'Electrical',
                content: 'Living in Dubai\'s modern homes requires special attention to electrical safety...\n\n[img]https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800[/img]\n\nAlways hire DEWA-certified electricians for any electrical work.',
                fullContent: '1. Regular Inspections are Key\n2. Don\'t Overload Circuits\n3. Watch for Warning Signs\n4. GFCI Protection is Mandatory\n5. Child-Proof Your Outlets',
                metaDesc: 'Essential electrical safety tips for Dubai homes. Learn about DEWA requirements and professional electrical services.',
                keywords: 'electrical safety, dubai, DEWA, home safety',
                comments: []
            },
            {
                id: Date.now() - 172800000,
                title: 'Smart Home Automation: Complete Dubai Guide',
                author: 'Ahmed Khan',
                authorEmail: 'ahmed@example.com',
                date: new Date(Date.now() - 172800000).toISOString(),
                category: 'Automation',
                content: 'Transform your Dubai home with smart automation. From energy savings to security...\n\n[img]https://images.unsplash.com/photo-1558002038-1055907df827?w=800[/img]\n\nControl everything from your phone.',
                fullContent: 'Benefits of Home Automation:\n- Energy Efficiency (save up to 30% on AC)\n- Enhanced Security\n- Convenience\n- Property Value Increase',
                metaDesc: 'Complete guide to home automation in Dubai. Smart solutions for modern living.',
                keywords: 'home automation, smart home, dubai, security',
                comments: [
                    {
                        id: Date.now() - 100000,
                        author: 'Fatima Said',
                        email: 'fatima@example.com',
                        content: 'Great guide! Do you install Control4 systems?',
                        date: new Date(Date.now() - 100000).toISOString()
                    }
                ]
            }
        ];
        savePosts();
    }
    renderPosts();
}

function savePosts() {
    localStorage.setItem('blog_posts', JSON.stringify(blogPosts));
}

function publishPost() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value.trim();
    const metaDesc = document.getElementById('postMetaDesc').value.trim();
    const keywords = document.getElementById('postKeywords').value.trim();
    
    if (!title || !content) {
        alert('Please fill in title and content');
        return;
    }
    
    // Extract preview (first 200 chars)
    const preview = content.replace(/\[img\].*?\[\/img\]/g, '[IMAGE]')
                          .replace(/\[pdf\].*?\[\/pdf\]/g, '[PDF]')
                          .replace(/\[yt\].*?\[\/yt\]/g, '[VIDEO]')
                          .substring(0, 200) + '...';
    
    const newPost = {
        id: Date.now(),
        title: title,
        author: currentUser.name,
        authorEmail: currentUser.email,
        date: new Date().toISOString(),
        category: category,
        content: preview,
        fullContent: content,
        metaDesc: metaDesc || title,
        keywords: keywords || category,
        comments: []
    };
    
    blogPosts.unshift(newPost);
    savePosts();
    renderPosts();
    clearPostForm();
    
    // Create SEO-friendly URL
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    history.pushState({}, '', `?post=${newPost.id}`);
    
    // Scroll to new post
    setTimeout(() => {
        document.getElementById(`post-${newPost.id}`).scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    alert('Post published successfully!');
}

function deletePost(postId) {
    const post = blogPosts.find(p => p.id == postId);
    
    if (!post) return;
    
    // Check permissions
    if (currentUser?.isAdmin || currentUser?.email === post.authorEmail) {
        if (confirm('Delete this post? This cannot be undone.')) {
            blogPosts = blogPosts.filter(p => p.id != postId);
            savePosts();
            renderPosts();
            alert('Post deleted');
        }
    } else {
        alert('You can only delete your own posts');
    }
}

function editPost(postId) {
    const post = blogPosts.find(p => p.id == postId);
    
    if (!post) return;
    
    if (currentUser?.isAdmin || currentUser?.email === post.authorEmail) {
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postContent').value = post.fullContent;
        document.getElementById('postMetaDesc').value = post.metaDesc || '';
        document.getElementById('postKeywords').value = post.keywords || '';
        
        // Scroll to write section
        document.getElementById('writeSection').scrollIntoView({ behavior: 'smooth' });
        
        // Remove old post after editing
        blogPosts = blogPosts.filter(p => p.id != postId);
        savePosts();
        
        alert('You can now edit and republish the post');
    } else {
        alert('You can only edit your own posts');
    }
}
// ==================== CONTENT FORMATTING ====================
function formatContent(content) {
    if (!content) return '';
    
    // Replace image tags
    content = content.replace(/\[img\](.*?)\[\/img\]/g, (match, url) => {
        return `<img src="${url.trim()}" alt="Blog image" style="max-width:100%; margin:1rem 0; border-radius:10px; cursor:pointer;" onclick="openLightbox('${url.trim()}')">`;
    });
    
    // Replace PDF tags with Google Drive viewer
    content = content.replace(/\[pdf\](.*?)\[\/pdf\]/g, (match, url) => {
        const pdfUrl = url.trim();
        // Use Google Docs viewer for any PDF
        return `<iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true" style="width:100%; height:500px; border:none; border-radius:10px; margin:1rem 0;"></iframe>`;
    });
    
    // Replace YouTube tags
    content = content.replace(/\[yt\](.*?)\[\/yt\]/g, (match, url) => {
        let videoId = '';
        const videoUrl = url.trim();
        
        if (videoUrl.includes('youtube.com/watch?v=')) {
            videoId = videoUrl.split('v=')[1].split('&')[0];
        } else if (videoUrl.includes('youtu.be/')) {
            videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        } else if (videoUrl.includes('youtube.com/embed/')) {
            videoId = videoUrl.split('embed/')[1].split('?')[0];
        }
        
        return videoId ? `<iframe src="https://www.youtube.com/embed/${videoId}" style="width:100%; height:400px; border:none; border-radius:10px; margin:1rem 0;" allowfullscreen></iframe>` : '[Invalid YouTube URL]';
    });
    
    // Replace newlines with <br>
    return content.replace(/\n/g, '<br>');
}

function insertImageTag() {
    const url = prompt('Enter image URL (from Imgur, Unsplash, etc.):');
    if (url) {
        insertAtCursor('[img]' + url.trim() + '[/img]\n');
    }
}

function insertPDFTag() {
    const url = prompt('Enter PDF URL (from Google Drive, Dropbox, etc.):\nMake sure the link is publicly accessible.');
    if (url) {
        insertAtCursor('[pdf]' + url.trim() + '[/pdf]\n');
    }
}

function insertYouTubeTag() {
    const url = prompt('Enter YouTube video URL:');
    if (url) {
        insertAtCursor('[yt]' + url.trim() + '[/yt]\n');
    }
}

function insertAtCursor(text) {
    const textarea = document.getElementById('postContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = textarea.value;
    
    textarea.value = content.substring(0, start) + text + content.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
}
// ==================== RENDERING ====================
function renderPosts(filteredPosts = null) {
    const postsToRender = filteredPosts || blogPosts;
    const blogMain = document.getElementById('blogMain');
    
    if (!blogMain) return;
    
    if (!postsToRender.length) {
        blogMain.innerHTML = '<div style="text-align: center; padding: 3rem; color: #8892b0;">No posts yet. Be the first to write!</div>';
        return;
    }
    
    let html = '';
    postsToRender.forEach(post => {
        const canDelete = currentUser?.isAdmin || currentUser?.email === post.authorEmail;
        const canEdit = currentUser?.isAdmin || currentUser?.email === post.authorEmail;
        const postDate = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        html += `
            <article class="blog-post" id="post-${post.id}" data-category="${post.category}" data-date="${post.date}">
                <div class="post-header">
                    <div class="post-meta">
                        <span><i class="fas fa-user"></i> ${escapeHtml(post.author)}</span>
                        <span><i class="fas fa-calendar"></i> ${postDate}</span>
                        <span><i class="fas fa-folder"></i> ${escapeHtml(post.category)}</span>
                    </div>
                    <div class="post-actions">
                        ${canEdit ? `<button class="action-btn" onclick="editPost(${post.id})" title="Edit"><i class="fas fa-edit"></i></button>` : ''}
                        ${canDelete ? `<button class="action-btn delete" onclick="deletePost(${post.id})" title="Delete"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                </div>
                
                <h2 class="post-title">${escapeHtml(post.title)}</h2>
                
                <div class="post-content">
                    ${formatContent(post.content)}
                </div>
                
                <div class="read-more" onclick="toggleFullPost(${post.id})">
                    Read Full Article <i class="fas fa-arrow-right"></i>
                </div>
                
                <div id="full-${post.id}" class="full-content">
                    ${formatContent(post.fullContent)}
                </div>
                
                <!-- Comments Section -->
                <div class="comments-section">
                    <h3><i class="fas fa-comments"></i> Comments (${post.comments.length})</h3>
                    
                    <div id="comments-${post.id}">
                        ${renderComments(post.comments, post.id)}
                    </div>
                    
                    ${currentUser ? `
                        <div class="comment-form">
                            <textarea id="comment-${post.id}" class="comment-input" placeholder="Write a comment..." rows="3"></textarea>
                            <button class="btn-secondary" onclick="addComment(${post.id})"><i class="fas fa-paper-plane"></i> Post Comment</button>
                        </div>
                    ` : '<p style="color:#8892b0;"><a href="#" onclick="document.getElementById(\'loginSection\').scrollIntoView({behavior:\'smooth\'}); return false;">Login</a> to comment</p>'}
                </div>
            </article>
        `;
    });
    
    blogMain.innerHTML = html;
    updateSidebar();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderComments(comments, postId) {
    if (!comments || !comments.length) return '<p style="color:#8892b0;">No comments yet. Be the first to comment!</p>';
    
    return comments.map(comment => {
        const canDelete = currentUser?.isAdmin || currentUser?.email === comment.email;
        const commentDate = new Date(comment.date).toLocaleDateString();
        
        return `
            <div class="comment" id="comment-${comment.id}">
                <div class="comment-header">
                    <span><i class="fas fa-user-circle"></i> ${escapeHtml(comment.author)}</span>
                    <span style="color:#8892b0; font-size:0.8rem;">${commentDate}</span>
                    ${canDelete ? `
                        <button class="action-btn delete" onclick="deleteComment(${postId}, ${comment.id})" title="Delete comment">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
                <div class="comment-content">${escapeHtml(comment.content).replace(/\n/g, '<br>')}</div>
            </div>
        `;
    }).join('');
}
// ==================== COMMENTS ====================
function addComment(postId) {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const content = document.getElementById(`comment-${postId}`).value.trim();
    if (!content) {
        alert('Please write a comment');
        return;
    }
    
    const post = blogPosts.find(p => p.id == postId);
    if (post) {
        post.comments.push({
            id: Date.now(),
            author: currentUser.name,
            email: currentUser.email,
            content: content,
            date: new Date().toISOString()
        });
        
        savePosts();
        renderPosts();
        
        // Clear comment box
        document.getElementById(`comment-${postId}`).value = '';
    }
}

function deleteComment(postId, commentId) {
    if (!currentUser) return;
    
    const post = blogPosts.find(p => p.id == postId);
    if (post) {
        const comment = post.comments.find(c => c.id == commentId);
        
        if (!comment) return;
        
        if (currentUser.isAdmin || currentUser.email === comment.email) {
            if (confirm('Delete this comment?')) {
                post.comments = post.comments.filter(c => c.id != commentId);
                savePosts();
                renderPosts();
            }
        } else {
            alert('You can only delete your own comments');
        }
    }
}
// ==================== POST FUNCTIONS ====================
function toggleFullPost(postId) {
    const fullContent = document.getElementById(`full-${postId}`);
    const readMore = event.target.closest('.read-more');
    
    if (fullContent.classList.contains('visible')) {
        fullContent.classList.remove('visible');
        if (readMore) readMore.innerHTML = 'Read Full Article <i class="fas fa-arrow-right"></i>';
    } else {
        fullContent.classList.add('visible');
        if (readMore) readMore.innerHTML = 'Show Less <i class="fas fa-arrow-up"></i>';
    }
}

function clearPostForm() {
    if (confirm('Clear the form?')) {
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postMetaDesc').value = '';
        document.getElementById('postKeywords').value = '';
    }
}
// ==================== SIDEBAR ====================
function updateSidebar() {
    // Update categories
    const categories = {};
    blogPosts.forEach(post => {
        categories[post.category] = (categories[post.category] || 0) + 1;
    });
    
    const categoryList = document.getElementById('categoryList');
    if (categoryList) {
        categoryList.innerHTML = '<li><a href="#" onclick="filterByCategory(\'all\'); return false;">All Posts <span>' + blogPosts.length + '</span></a></li>' +
            Object.entries(categories).map(([cat, count]) => `
                <li><a href="#" onclick="filterByCategory('${cat}'); return false;">${cat} <span>${count}</span></a></li>
            `).join('');
    }
    
    // Recent posts
    const recentPosts = blogPosts.slice(0, 5);
    const recentDiv = document.getElementById('recentPosts');
    if (recentDiv) {
        recentDiv.innerHTML = recentPosts.map(post => {
            const firstImage = extractFirstImage(post.fullContent) || 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=200';
            return `
                <div class="recent-post">
                    <img src="${firstImage}" alt="${post.title}" loading="lazy">
                    <div class="recent-post-info">
                        <h4><a href="#" onclick="jumpToPost(${post.id}); return false;">${escapeHtml(post.title.substring(0, 40))}...</a></h4>
                        <div class="date">${new Date(post.date).toLocaleDateString()}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Popular tags
    const allKeywords = blogPosts.flatMap(p => (p.keywords || '').split(',').map(k => k.trim()).filter(k => k));
    const tagCounts = {};
    allKeywords.forEach(k => { if (k) tagCounts[k] = (tagCounts[k] || 0) + 1; });
    
    const tags = Object.entries(tagCounts).sort((a,b) => b[1] - a[1]).slice(0, 10);
    const tagsDiv = document.getElementById('popularTags');
    if (tagsDiv) {
        tagsDiv.innerHTML = tags.map(([tag, count]) => `
            <span class="tag" onclick="searchByTag('${tag}')">#${tag} (${count})</span>
        `).join('');
    }
}

function extractFirstImage(content) {
    if (!content) return null;
    const match = content.match(/\[img\](.*?)\[\/img\]/);
    return match ? match[1] : null;
}
// ==================== SEARCH ====================
function searchPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!query) {
        renderPosts();
        return;
    }
    
    const words = query.split(' ').filter(w => w.length > 1);
    
    const filtered = blogPosts.filter(post => {
        const searchText = (post.title + ' ' + post.content + ' ' + post.fullContent + ' ' + (post.keywords || '')).toLowerCase();
        
        // Score the post based on matches
        let score = 0;
        words.forEach(word => {
            if (searchText.includes(word)) {
                score += 1;
            } else {
                // Check for partial matches (fuzzy)
                const wordsInText = searchText.split(/\s+/);
                wordsInText.forEach(textWord => {
                    if (textWord.includes(word) || word.includes(textWord)) {
                        score += 0.5;
                    }
                });
            }
        });
        
        return score > 0;
    });
    
    renderPosts(filtered);
}

function searchByTag(tag) {
    document.getElementById('searchInput').value = tag;
    searchPosts();
}

function filterByCategory(category) {
    if (category === 'all') {
        renderPosts();
    } else {
        const filtered = blogPosts.filter(p => p.category === category);
        renderPosts(filtered);
    }
}
// ==================== UTILITIES ====================
function jumpToPost(postId) {
    const element = document.getElementById(`post-${postId}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        
        // Update URL
        history.pushState({}, '', `?post=${postId}`);
        
        // Highlight the post
        element.style.transition = 'box-shadow 0.5s';
        element.style.boxShadow = '0 0 30px rgba(0,255,255,0.5)';
        setTimeout(() => {
            element.style.boxShadow = 'none';
        }, 2000);
    }
}

function scrollToPost(postId) {
    setTimeout(() => {
        jumpToPost(postId);
    }, 500);
}

// ==================== LIGHTBOX ====================
function openLightbox(imgUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    
    if (lightbox && lightboxImg) {
        lightboxImg.src = imgUrl;
        lightbox.classList.add('visible');
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

// Close lightbox with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
// ==================== EXPORT/IMPORT (for backup) ====================
function exportPosts() {
    const dataStr = JSON.stringify(blogPosts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'sanatech_blog_backup_' + new Date().toISOString().slice(0,10) + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importPosts() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    if (confirm('Replace all current posts with imported data?')) {
                        blogPosts = imported;
                        savePosts();
                        renderPosts();
                        alert('Posts imported successfully!');
                    }
                } else {
                    alert('Invalid file format');
                }
            } catch (err) {
                alert('Error reading file');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Add export/import buttons for admin
function addAdminTools() {
    if (currentUser?.isAdmin) {
        const sidebar = document.querySelector('.blog-sidebar');
        if (sidebar && !document.getElementById('adminTools')) {
            const adminDiv = document.createElement('div');
            adminDiv.id = 'adminTools';
            adminDiv.className = 'sidebar-widget';
            adminDiv.innerHTML = `
                <h3 class="widget-title">Admin Tools</h3>
                <button class="btn-secondary" onclick="exportPosts()" style="width:100%; margin-bottom:10px;">
                    <i class="fas fa-download"></i> Export Posts
                </button>
                <button class="btn-secondary" onclick="importPosts()" style="width:100%;">
                    <i class="fas fa-upload"></i> Import Posts
                </button>
            `;
            sidebar.appendChild(adminDiv);
        }
    }
}

// Call this after rendering
setInterval(() => {
    if (currentUser?.isAdmin) {
        addAdminTools();
    }
}, 1000);
