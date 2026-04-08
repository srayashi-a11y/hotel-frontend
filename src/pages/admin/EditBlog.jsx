import { useState, useEffect, useRef } from "react";
import blogAPI, { IMAGE_BASE_URL } from "../../services/blogAPI";
import Swal from "sweetalert2";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

function EditBlog({ blog, onClose, onUpdated }) {

  const [form, setForm] = useState({
    title: "",
    shortdes: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const fileInputRef = useRef(null);

  // =========================
  // 🟢 TIPTAP EDITOR (REPLACED QUILL)
  // =========================
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      Link.configure({
        openOnClick: true
      }),
      Placeholder.configure({
        placeholder: "Write your blog content..."
      })
    ],
    content: "",
  });

  // ✅ Prefill data
  useEffect(() => {
    if (blog && editor) {

      setForm({
        title: blog.title || "",
        shortdes: blog.shortdes || ""
      });

      // ✅ set editor content
      editor.commands.setContent(blog.content || "");

      setPreview(blog.image ? `${IMAGE_BASE_URL}${blog.image}` : "");
    }
  }, [blog, editor]);

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

    const content = editor?.getHTML() || "";

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

  if (!editor) return null;

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

          {/* ========================= */}
          {/* 🟢 TIPTAP EDITOR (REPLACED QUILL UI) */}
          {/* ========================= */}
          {/* ========================= */}
{/* 🟢 TOOLBAR (ALL BUTTONS FIXED) */}
{/* ========================= */}

<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "10px",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#fff"
  }}
>

  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
    B
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
    I
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}>
    S
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
    H1
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
    H2
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
    H3
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
    H4
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}>
    H5
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}>
    H6
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
    UL
  </button>

  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
    OL
  </button>

  <button
    type="button"
    onClick={() => {
      const url = prompt("Enter URL");
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }}
  >
    Link
  </button>

</div>

{/* ========================= */}
{/* 🟢 EDITOR */}
{/* ========================= */}

<div
  style={{
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    background: "#fff",
    minHeight: "200px"
  }}
>
  <EditorContent editor={editor} />
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

