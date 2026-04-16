import { NavLink,Link, useNavigate } from "react-router-dom";
import "../styles/header.css"

function Header() {

const navigate = useNavigate();
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
  window.location.reload(); // refresh page
};

return (

<>

{/* Top Section */}

<div className="topsection">
 <div className="container">
  <div className="row" style={{ justifyContent: "flex-end" }}>

   <div className="col-md-7 col-sm-8 col-xs-12 topsection-right">

    <div className="topsection-right01">
     <ul>
      <li><img src="/images/phoneicon.png" alt=""/> +971585170587</li>
      <li><img src="/images/locationicon.png" alt=""/>  Calangute Beach, Goa, India</li>
      <li>
       <img src="/images/message-icon.png" alt=""/>
       <a href="mailto:Adrian@seanest.com">
        Adrian@seanest.com
       </a>
      </li>
      <div className="clr"></div>
     </ul>
    </div>

    <div className="topsection-right02">
     <ul>
      <li><a href="#"><i className="fa fa-facebook-f"></i></a></li>
      <li><a href="#"><i className="fa fa-twitter"></i></a></li>
      <li><a href="#"><i className="fa fa-instagram"></i></a></li>
      <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
      <div className="clr"></div>
     </ul>
    </div>

   </div>

  </div>
 </div>
</div>


{/* Header */}

<div className="mainbanner-section innerpagebn">

<header>
  <div className="mobile-breadcrumb">
  <button
    className="breadcrumb-btn"
    onClick={() =>
      document
        .querySelector(".mobile-menu-dropdown")
        .classList.toggle("show-menu")
    }
  >
    ☰ Menu
  </button>

  <div className="mobile-menu-dropdown">
    <ul>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/room">Room</NavLink></li>
      <li><NavLink to="/about">Who We Are</NavLink></li>
      <li><NavLink to="/resturant">Restaurant</NavLink></li>
      <li><NavLink to="/blogs">Blog</NavLink></li>
      <li><NavLink to="/contact">Contact</NavLink></li>
    </ul>
  </div>
</div>

<div className="container">

<div className="row">


{/* Logo */}

<div className="col-md-2 col-sm-2 col-xs-12">

<div className="logo-section">
<Link to="/">
<img src="/images/seanest.png" alt="logo"/>
</Link>
</div>

</div>


{/* Menu */}

<div className="col-md-8 col-sm-8 col-xs-12">

<div id="cssmenu" className="align-center">

<ul>

<li>
<NavLink to="/" end>
Home
</NavLink>
</li>



<li>
<NavLink to="/room">
Room
</NavLink>
</li>

<li>
<NavLink to="/about">
WHO WE ARE
</NavLink>
</li>
<li>
<NavLink to="/resturant">
Resturant
</NavLink>
</li>
<li>
<NavLink to="/blogs">
BLOG
</NavLink>
</li>
<li>
<NavLink to="/contact">
CONTACTS
</NavLink>
</li>

</ul>

</div>

</div>


{/* Auth Buttons */}

<div className="col-md-2 col-sm-2 col-xs-12 banner-right">

{!token ? (

<div style={{display:"flex", gap:"10px", justifyContent:"flex-end"}}>

<NavLink
to="/login"
className={({ isActive }) =>
  isActive ? "btn btn-sm active-auth" : "btn btn-sm"
}
style={{ background: "#f8f5efde", color: "#000" }}
>
<i className="fa fa-sign-in"></i> Login
</NavLink>

<NavLink
to="/register"
className={({ isActive }) =>
  isActive ? "btn btn-sm active-auth" : "btn btn-sm"
}
style={{ background: "#f8f5efde", color: "#000" }}
>
<i className="fa fa-user-plus"></i> Register
</NavLink>

</div>

) : (

<div style={{display:"flex", gap:"10px", justifyContent:"flex-end"}}>

{/* Dashboard Button */}
<button
onClick={() => {
  if (user?.role === "admin") {
    navigate("/admin/dashboard");
  } else {
    navigate("/user/dashboard");
  }
}}
className="btn btn-sm"
style={{background:"#f8f5efde"}}
>
<i className="fa fa-dashboard"></i> Dashboard
</button>

{/* Logout */}
<button
onClick={handleLogout}
className="btn btn-sm"
style={{background:"#e8e1d4"}}
>
<i className="fa fa-sign-out"></i> Logout
</button>

</div>

)}

</div>


</div>

</div>

</header>

</div>

</>

);

}

export default Header;