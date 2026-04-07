import React from "react";
import { IMAGE_BASE_URL } from "../../services/blogAPI";

function ViewBlog({ blog, onClose }) {
  return (
    <div className="blog-modal-overlay">

      <div className="blog-modal">

        <button
          className="blog-modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="blog-modal-title">{blog.title}</h2>

        {/* Image */}
        {blog.image && (
          <div className="blog-modal-image">
            <img
              src={`${IMAGE_BASE_URL}${blog.image}`}
              alt="blog"
            />
          </div>
        )}

        {/* Content */}
        <div className="blog-modal-content">
          <h4>Shortdescription</h4>
          <div style={{fontSize:"15px"}}>{blog.shortdes}</div>
          <hr/>
          <h4>Description</h4>

          <div
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

      </div>

    </div>
  );
}

export default ViewBlog;