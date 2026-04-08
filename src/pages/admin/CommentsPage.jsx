import { useEffect, useState } from "react";
import blogAPI from "../../services/blogAPI";
import "../../styles/admin.css";
import Swal from "sweetalert2";
import ContactMessages from "./ContactMessages"; // ✅ add this


const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState("comments");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

        const res = await blogAPI.get("/comments", {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        });
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (blogSlug, commentId) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This comment will be deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#c59d5f",
    cancelButtonColor: "#999",
    confirmButtonText: "Yes, delete it!",
  });

  if (confirm.isConfirmed) {
    try {
      await blogAPI.delete(`/comments/${blogSlug}/${commentId}`);

      Swal.fire("Deleted!", "Comment removed successfully.", "success");

      fetchComments(); // refresh table
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete comment", "error");
    }
  }
 };

  return (
    <div className="admin-comments-wrapper">

      {/* TABS */}
      <div className="admin-tabs">
        <button
          className={activeTab === "comments" ? "active" : ""}
          onClick={() => setActiveTab("comments")}
        >
          Blog Comments
        </button>

        <button
          className={activeTab === "other" ? "active" : ""}
          onClick={() => setActiveTab("other")}
        >
         Contact Message
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "comments" && (

           <div className="admin-content">

      <div className="table-container">
        <table className="contact-table">
            <thead>
              <tr>
                <th>Blog</th>
                <th>User</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {comments.map((c, i) => (
                <tr key={i}>
                  <td>{c.blogTitle}</td>
                  <td>{c.name}</td>
                  <td>{c.message}</td>
                  <td>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                        className="delete-btn"
                        onClick={() => handleDelete(c.blogSlug, c._id)}
                    >
                        Delete
                    </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        </div>
      )}

      {activeTab === "other" && <ContactMessages />}

    </div>
  );
};

export default CommentsPage;