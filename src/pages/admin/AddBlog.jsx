import { useState, useRef } from "react";
import blogAPI from "../../services/blogAPI";
import Swal from "sweetalert2";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

function AddBlog() {
  const [blog, setBlog] = useState({
    title: "",
    shortdes: "",
    content: ""
  });

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

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
        placeholder: "Write your blog like a pro editor..."
      })
    ],
    content: "<p></p>",
    onUpdate: ({ editor }) => {
      setBlog((prev) => ({
        ...prev,
        content: editor.getHTML()
      }));
    }
  });

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const addLink = () => {
    const url = prompt("Enter URL");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  // ✅ ACTIVE CHECK HELPER (IMPORTANT PART)
  const isActive = (type, attrs = {}) => {
    if (!editor) return false;
    return editor.isActive(type, attrs);
  };

  const btnClass = (active) =>
    active ? "active" : "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = editor?.getHTML() || "";

    if (!blog.title || !content || !image || !blog.shortdes) {
      Swal.fire("Error", "All fields required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("shortdes", blog.shortdes);
    formData.append("content", content);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");

      await blogAPI.post("/blogs/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      Swal.fire("Success", "Blog added", "success");

      setBlog({ title: "", shortdes: "", content: "" });
      setImage(null);

      if (editor) editor.commands.setContent("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Failed to add blog", "error");
    }
  };

  if (!editor) return null;

  return (
    <div className="addblog-container">
      <h2 className="addblog-title">Add Blog</h2>

      <form className="addblog-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Blog Title"
          value={blog.title}
          onChange={handleChange}
        />

        <input
          name="shortdes"
          placeholder="Short Description"
          value={blog.shortdes}
          onChange={handleChange}
        />

        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* TOOLBAR */}
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #e5e5e5",
            borderRadius: "10px",
            background: "#fff"
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              padding: "8px",
              borderBottom: "1px solid #eee"
            }}
          >
            <button
              type="button"
              className={btnClass(isActive("bold"))}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              B
            </button>

            <button
              type="button"
              className={btnClass(isActive("italic"))}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              I
            </button>

            <button
              type="button"
              className={btnClass(isActive("strike"))}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              S
            </button>

            <button
              type="button"
              className={btnClass(isActive("heading", { level: 1 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              H1
            </button>

            <button
              type="button"
              className={btnClass(isActive("heading", { level: 2 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </button>

            <button
              type="button"
              className={btnClass(isActive("heading", { level: 3 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              H3
            </button>

            <button
              type="button"
              className={btnClass(isActive("heading", { level: 4 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
            >
              H4
            </button>

            <button
              type="button"
              className={btnClass(isActive("heading", { level: 5 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
            >
              H5
            </button>

            <button
              type="button"
              className={btnClass(isActive("heading", { level: 6 }))}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 6 }).run()
              }
            >
              H6
            </button>

            <button
              type="button"
              className={btnClass(isActive("bulletList"))}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              UL
            </button>

            <button
              type="button"
              className={btnClass(isActive("orderedList"))}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              OL
            </button>

            <button type="button" onClick={addLink}>
              Link
            </button>
          </div>

          {/* EDITOR */}
          <div style={{ minHeight: "320px", padding: "12px" }}>
            <EditorContent editor={editor} />
          </div>
        </div>

        <button className="addblog-btn">Publish Blog</button>
      </form>
    </div>
  );
}

export default AddBlog;