import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import blogAPI, { IMAGE_BASE_URL } from "../services/blogAPI";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/blog.css";

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [recent, setRecent] = useState([]);
  const [name, setName]=useState("");
  const [message,setMessage]=useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await blogAPI.get(`/blogs/${slug}`);
        setBlog(res.data);

        const all = await blogAPI.get("/blogs");

        const filtered = all.data
          .filter((b) => b.slug !== slug)
          .slice(0, 5);

        setRecent(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [slug]);
 
  const handleComment = async (e) => {
  e.preventDefault();

  try {
    const res = await blogAPI.post(`/blogs/${slug}/comment`, {
      name,
      message,
    });

    // ✅ backend returns full updated comments array
    setBlog({
      ...blog,
      comments: res.data, // ✅ directly set full array
    });

    setName("");
    setMessage("");
  } catch (err) {
    console.error(err);
  }
};
 

  if (!blog) return <p>Loading...</p>;
  const shotcmnt = [...(blog.comments || [])].reverse();

  return (
    <>
      <Header />

      <div className="blog-details-page">
        <div className="blog-details-container">

          {/* LEFT */}
          <div className="blog-details-left">

            <img
              src={`${IMAGE_BASE_URL}${blog.image}`}
              alt={blog.title}
            />

            <h1>{blog.title}</h1>

            <p className="blog-date1">
                📅 {new Date(blog.createdAt).toLocaleDateString()}
                </p>

            <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
            <hr/>
            
            <hr/>

            <div>
                <h2>Comments</h2>
                <form className="comment-form" onSubmit={handleComment}>
                    <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    required
                    />
                    <textarea
                    placeholder="Write your comment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    ></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            </div>
            <hr/>
            <div className="comment-list">
  {shotcmnt.length > 0 ? (
    <>
      {(showAll ? shotcmnt : shotcmnt.slice(0, 3)).map((c) => (
        <div key={c._id} className="comment-item">
          <h5>{c.name}</h5>
          <p>{c.message}</p>
          <small>
            {new Date(c.createdAt).toLocaleString()}
          </small>
        </div>
      ))}

      {shotcmnt.length > 3 && !showAll && (
        <button
          className="load-more-btn"
          onClick={() => setShowAll(true)}
        >
          Load More Comments ↓
        </button>
      )}
    </>
  ) : (
    <p>No comments yet.</p>
  )}
</div>

          </div>

          {/* RIGHT */}
          <div className="blog-details-right">
            <div className="blog-details-right1">
                <h3>Recent Posts</h3>

            <ul>
              {recent.map((b) => (
                <li key={b._id} onClick={() => navigate(`/blog/${b.slug}`)}>
                  {b.title}
                </li>
              ))}
            </ul>
            </div>

            

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetails;










