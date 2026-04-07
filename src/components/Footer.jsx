import { Link } from "react-router-dom";

function Footer() {

  const year = new Date().getFullYear(); // ✅ dynamic year

  const myPages = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/room" },
    { name: "Restaurant", path: "/resturant" },
    { name: "Blogs", path: "/blogs" }
  ];

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Book Now", path: "/room" }
  ];

  return (

    <>

      <footer>
        <div className="container">
          <div className="row">

            {/* LEFT */}
            <div className="col-md-3 footer01">

              <h2>
                <img src="/images/seanest.png" alt="logo"/>
              </h2>

              <p>
                Experience luxury by the sea with world-class hospitality, fine dining, and unforgettable stays.
              </p>

              <h5>
                <img src="/images/footericon01.png" alt=""/>
                Calangute Beach, Goa, India 🌊
              </h5>

              <h5>
                <img src="/images/footericon02.png" alt=""/>
                +91 98765 43210
              </h5>

            </div>

            {/* 🔥 MY PAGES (replaces Explore) */}
            <div className="col-md-3 footer02">
              <h2>My Pages</h2>

              <ul>
                {myPages.map((item, i) => (
                  <li key={i}>
                    <Link to={item.path}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 🔥 UPDATED QUICK LINKS */}
            <div className="col-md-3 footer03">
              <h2>Quick Links</h2>

              <ul>
                {quickLinks.map((item, i) => (
                  <li key={i}>
                    <Link to={item.path}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT */}
            <div className="col-md-3 footer04">

              <h2>Stay Connected</h2>

              <ul>
                <li><i className="fa fa-facebook"></i></li>
                <li><i className="fa fa-twitter"></i></li>
                <li><i className="fa fa-instagram"></i></li>
                <li><i className="fa fa-linkedin"></i></li>
              </ul>

              <p style={{marginTop:"10px"}}>
                Follow us for exclusive offers & seaside experiences ✨
              </p>

            </div>

          </div>
        </div>
      </footer>

      {/* 🔥 DYNAMIC COPYRIGHT */}
      <div className="copyright-section">
        <div className="container">
          <p>
            © {year} SeaNest Goa • All Rights Reserved 🌴
          </p>
        </div>
      </div>

    </>

  );
}

export default Footer;