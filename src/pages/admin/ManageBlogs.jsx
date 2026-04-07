import { useEffect, useState } from "react";
import blogAPI, { IMAGE_BASE_URL }  from "../../services/blogAPI";
import Swal from "sweetalert2";
import ViewBlog from "./ViewBlog";
import EditBlog from "./EditBlog"

function ManageBlogs() {

  const [blogs, setBlogs] = useState([]);
  const [viewBlog, setViewBlog] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [currentPage,setCurrentPage]=useState(1);
  const blogsPerPage=6;

  const fetchBlogs = async () => {
    try {
      const res = await blogAPI.get("/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {

  const result = await Swal.fire({
    title: "Delete Blog?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Yes, Delete"
  });

  if (result.isConfirmed) {
    try {

      const token = localStorage.getItem("token"); // ✅ get token

      await blogAPI.delete(`/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // ✅ send token
        }
      });

      Swal.fire("Deleted!", "Blog deleted successfully", "success");

      fetchBlogs();

    } catch (err) {
      console.log(err);

      Swal.fire("Error", "Unauthorized or failed", "error");
    }
  }
};

  useEffect(() => {
    fetchBlogs();
  }, []);

  const indexOfLastBlog=currentPage * blogsPerPage;
  const indexOfFirstBlog= indexOfLastBlog -blogsPerPage;
  const currentBlogs=blogs.slice(indexOfFirstBlog,indexOfLastBlog)
  const totalPages=Math.ceil(blogs.length/blogsPerPage);

  return (

    <div className="manage-room-container">

      <h2 className="manage-room-title">Manage Blogs</h2>

      <div className="room-table-wrapper">

        <table className="room-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Content</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {currentBlogs.map((blog, index) => (

              <tr key={blog._id}>

               <td>{indexOfFirstBlog + index + 1}</td>

                <td>
                  {blog.image && (
                    <img
                   src={`${IMAGE_BASE_URL}${blog.image}`}
                   alt={blog.name}
                   style={{
                    width:"80px",
                    height:"60px",
                    objectFit:"cover",
                    borderRadius:"5px"
                   }}
                  />
                  )}
                </td>
                

                <td>{blog.title}</td>
                  <td>
                  {blog.shortdes
                    ? blog.shortdes.substring(0, 40) +
                      (blog.shortdes.length > 40 ? "..." : "")
                    : ""}
                </td>
                  <td>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
         

                <td>

                    <button
                        onClick={() => setEditBlog(blog)}
                        style={{
                            background: "#3498db",
                            color: "#fff",
                            border: "none",
                            padding: "6px 10px",
                            marginRight: "5px",
                            borderRadius: "4px"
                        }}
                        >
                        Edit
                   </button>

                  <button
                    onClick={() => setViewBlog(blog)}
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      marginRight: "5px",
                      borderRadius: "4px"
                    }}
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(blog._id)}
                    style={{
                      background: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px"
                    }}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>
          

        </table>
        <div style={{marginTop:"15px",textAlign:"center"}}>
            {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px",
                background: currentPage === i + 1 ? "#013152" : "#ddd",
                color: currentPage === i + 1 ? "#fff" : "#000",
                cursor: "pointer"
              }}
            >
              {i + 1}
            </button>
))}
        </div>

    {viewBlog && (
            <ViewBlog
                blog={viewBlog}
                onClose={() => setViewBlog(null)}
            />
            )}
            {editBlog && (
            <EditBlog
                blog={editBlog}
                onClose={() => setEditBlog(null)}
                onUpdated={fetchBlogs}
            />
            )}

      </div>

    </div>

  );
}

export default ManageBlogs;