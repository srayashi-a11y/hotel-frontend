import { useEffect, useState } from "react";
import blogAPI, { IMAGE_BASE_URL } from "../services/blogAPI";
import "../styles/blog.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogAPI.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  // pagination logic
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
     <>
       <Header/>
   
   <div className="blogs-page">
      

      <div >
        <div className="inner-content1 clearfix">
          <h1>Blog</h1>

          <div className="blog-section">

            {/* LEFT SIDE */}
            <div className="blog-section-left">
              <div className="blog-section-left-main">

                {currentBlogs.map((blog) => (
                  <div 
                    className="blog-section-left01"
                    key={blog._id}
                    onClick={() => navigate(`/blog/${blog.slug}`)}
                    style={{cursor:"pointer"}}
                  >
                    
                <div className="imgsec">
                  <img
                    src={`${IMAGE_BASE_URL}${blog.image}`}
                    alt={blog.title}
                  />
                </div>

                {/* NEW CONTENT BOX */}
                <div className="blog-card-body">

                  {/* DATE TOP RIGHT */}
                  <div className="blog-date">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>

                  <h3>{blog.title}</h3>

                  <p>{blog.shortdes}</p>

                  

                    <button
                    className="tag-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blog/${blog.slug}`);
                    }}
                  >
                    Continue Reading
                  </button>

                </div>
              </div>
                ))}

                {/* PAGINATION */}
                
              </div>
              <div className="blogpagenation-section">
                  <ul>
                    <li onClick={() => setCurrentPage(currentPage - 1)}>
                      &lt;
                    </li>

                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                      >
                        {i + 1}
                      </li>
                    ))}

                    <li onClick={() => setCurrentPage(currentPage + 1)}>
                      &gt;
                    </li>
                  </ul>
                </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="blog-section-right">

             

              {/* RECENT POSTS */}
              <div className="blog-section-right01">
                <div className="titelsec">
                  <h3>Recent Posts</h3>
                </div>

                <ul>
                  {blogs.slice(0, 5).map((b) => (
                    <li key={b._id}>
                      <span onClick={() => navigate(`/blog/${b.slug}`)}>
                      {b.title}
                    </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </div>
      </div>
   </div>
<Footer/>
</>
  );
};

export default Blogs;