<!-- Write New Blog Section -->
<div class="write-blog-section">
    <h2><i class="fas fa-pen-fancy"></i> Write a New Blog Post</h2>
    <input type="text" id="newBlogTitle" placeholder="Blog Title *" required>
    <select id="newBlogCategory">
        <option value="Electrical">Electrical</option>
        <option value="Automation">Automation</option>
        <option value="Handyman">Handyman</option>
        <option value="Tiles">Tiles & Marble</option>
    </select>
    
    <div class="media-link-input">
        <input type="text" id="mediaLink" placeholder="Paste image or video link here...">
        <button class="btn-primary" onclick="addMedia()">Add Media</button>
    </div>
    
    <div class="media-preview" id="mediaPreview"></div>
    
    <textarea id="newBlogContent" rows="5" placeholder="Blog content... *" required></textarea>
    
    <div style="display: flex; gap: 10px;">
        <button class="btn-primary" onclick="publishBlog()">
            <i class="fas fa-cloud-upload-alt"></i> Publish Blog Post
        </button>
        <button class="btn-secondary" onclick="clearBlogForm()">
            <i class="fas fa-trash"></i> Clear
        </button>
    </div>
</div>

<!-- Blog Main Content -->
<div class="blog-main" id="blogMain"></div>
