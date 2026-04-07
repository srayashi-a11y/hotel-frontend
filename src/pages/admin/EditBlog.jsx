import { useState, useEffect, useRef } from "react";
import blogAPI, { IMAGE_BASE_URL } from "../../services/blogAPI";
import Swal from "sweetalert2";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

function EditBlog({ blog, onClose, onUpdated }) {

  const [form, setForm] = useState({
    title: "",
    shortdes: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const fileInputRef = useRef(null);

  // ✅ Quill
  const { quill, quillRef } = useQuill();

  // ✅ Prefill data (FIXED)
  useEffect(() => {
    if (blog && quill) {

      setForm({
        title: blog.title || "",
        shortdes: blog.shortdes || ""
      });

      // ✅ set content properly
      quill.clipboard.dangerouslyPasteHTML(blog.content || "");

      setPreview(blog.image ? `${IMAGE_BASE_URL}${blog.image}` : "");
    }
  }, [blog, quill]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const content = quill?.root.innerHTML || "";

    const cleanContent = content.replace(/<(.|\n)*?>/g, "").trim();

    if (!form.title || !form.shortdes || !cleanContent) {
      Swal.fire("Error", "All fields required", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("shortdes", form.shortdes);
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      const token = localStorage.getItem("token");

      await blogAPI.put(`/blogs/${blog._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      Swal.fire("Updated!", "Blog updated successfully", "success");

      onUpdated();
      onClose();

    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Update failed", "error");
    }
  };

  return (
    <div className="blog-modal-overlay">

      <div className="blog-modal">

        <button className="blog-modal-close" onClick={onClose}>×</button>

        <h2 className="addblog-title">Edit Blog</h2>

        <form className="addblog-form" onSubmit={handleUpdate}>

          {/* Title */}
          <input
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
          />

          {/* Short Description */}
          <input
            name="shortdes"
            placeholder="Short Description"
            value={form.shortdes}
            onChange={handleChange}
          />

          {/* Image */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImage}
          />

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "20%",
                marginTop: "10px",
                borderRadius: "6px"
              }}
            />
          )}

          {/* Quill Editor */}
          <div style={{ marginTop: "20px" }}>
            <h4>Modern Editor</h4>

            <div
              ref={quillRef}
              style={{ background: "#fff", height: "200px" }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>

            <button className="addblog-btn">
              Update Blog
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditBlog;