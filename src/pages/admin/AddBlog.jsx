import { useState, useRef } from "react";
import blogAPI from "../../services/blogAPI";
import Swal from "sweetalert2";
import { useQuill } from "react-quilljs"; // ✅ correct import
import "quill/dist/quill.snow.css"; // ✅ correct css

function AddBlog() {

  const [blog, setBlog] = useState({
    title: "",
    shortdes:"",
    content: ""
  });

  const [image, setImage] = useState(null);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // ✅ NEW Quill setup
  const { quill, quillRef } = useQuill();

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  // OLD editor
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const content = quill?.root.innerHTML;

  if (!blog.title || !content || !image||!blog.shortdes) {
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

    // reset
    setBlog({ title: "" ,shortdes:"",content: "" });
    setImage(null);

    if (quill) {
      quill.setText(""); // ✅ clear quill
    }

    // ✅ FIX: check before using
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  } catch (err) {
    console.log(err);
    Swal.fire("Error", "Failed to add blog", "error");
  }
};

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

        

        

        {/* ✅ NEW Quill Editor */}
        <div style={{ marginTop: "20px" }}>
          <h4>Modern Editor</h4>

          <div
            ref={quillRef}
            style={{ background: "#fff", height: "200px" }}
          />
        </div>

        <button className="addblog-btn">Save Blog</button>

      </form>

    </div>
  );
}

export default AddBlog;