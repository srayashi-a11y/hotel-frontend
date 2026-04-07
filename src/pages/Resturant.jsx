import React from "react";
import "../styles/resturant.css";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Restaurant() {
  useEffect(() => {
  const carousel = document.querySelector(".dish-carousel");

  const interval = setInterval(() => {
    if (carousel) {
      carousel.scrollBy({ left: 300, behavior: "smooth" });

      // loop back
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
        carousel.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  }, 2500);

  return () => clearInterval(interval);
}, []);
  return (
    <>
    <Header/>
   
    <div className="restaurant-page">

      {/* HERO */}
      <section className="rest-hero">
        
      </section>

      {/* INTRO */}
      <section className="rest-intro">
        <span className="tag">Our Restaurant</span>
        <h2>Where Taste Meets Luxury</h2>
        <p>
          Indulge in a curated culinary journey crafted by expert chefs using the
          finest ingredients. Every dish is a masterpiece designed to delight your
          senses.
        </p>
        <div className="line"></div>
      </section>

      {/* DISHES */}
      {/* DISHES */}
<section className="dish-carousel-section">
  <h2>Signature Dishes</h2>

  <div className="carousel-wrapper">

    <button className="nav left" onClick={() => {
      document.querySelector(".dish-carousel").scrollBy({ left: -300, behavior: "smooth" });
    }}>‹</button>

    <div className="dish-carousel">

      <div className="dish-item">
        <img src="/images/dishi.jpg" />
        <p>Grilled Salmon</p>
      </div>

      <div className="dish-item">
        <img src="/images/dishii.jfif" />
        <p>Classic Pasta</p>
      </div>

      <div className="dish-item">
        <img src="/images/dishviii.jfif" />
        <p>Mutton Special</p>
      </div>

      <div className="dish-item">
        <img src="/images/dishiii.jfif" />
        <p>Chicken Roast</p>
      </div>

      <div className="dish-item">
        <img src="/images/dishiv.jfif" />
        <p>Seafood Platter</p>
      </div>

      <div className="dish-item">
        <img src="/images/dishv.jfif" />
        <p>Veg Delight</p>
      </div>

      <div className="dish-item">
        <img src="/images/dishvi.jfif" />
        <p>BBQ Special</p>
      </div>

      <div className="dish-item">
        <img src="/images/dishvii.jfif" />
        <p>Dessert Special</p>
      </div>

    </div>

    <button className="nav right" onClick={() => {
      document.querySelector(".dish-carousel").scrollBy({ left: 300, behavior: "smooth" });
    }}>›</button>

  </div>
</section>

      {/* CHEF */}
      <section className="rest-chef">

  <div className="chef-row">

    {/* COLUMN 1 */}
    <div className="chef-content">
      <div className="chef-image">
        <img src="/images/cheff.jpg" alt="chef" />
      </div>
      <div className="chef-text">
        <span className="tag">Head Chef</span>
        <h2>Crafted with Passion</h2>
        <p>
          Our head chef brings years of global culinary experience, blending
          traditional techniques with modern innovation.
        </p>
      </div>
    </div>

    {/* COLUMN 2 */}
    <div className="chef-content reverse">
      <div className="chef-image">
        <img src="/images/chef2.jfif" alt="chef" />
      </div>
      <div className="chef-text">
        <span className="tag">Sous Chef</span>
        <h2>Master of Flavors</h2>
        <p>
          Expert in fusion cuisine, creating bold and exciting taste experiences
          with modern techniques.
        </p>
      </div>
    </div>

  </div>

</section>

      {/* GALLERY */}
      <section className="rest-gallery">
        <h2>Ambience</h2>
        <div className="gallery-grid">
          <img src="/images/rest1.jfif" alt="" />
          <img src="/images/rest2.jfif" alt="" />
         
        </div>
        <div className="gallery-grid1">
          
          <img src="/images/rest3.jfif" alt="" />
           <img src="/images/rest4.jpg" alt="" />
        </div>
      </section>

      {/* CALL */}
      <section className="rest-call">
        <p style={{
          background: "#fffaf3",
          padding: "15px 20px",
          borderLeft: "4px solid black",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "1.05rem",
          color: "#333",
          borderRadius: "6px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
        }}>
          📞 +91 98765 43210 — Reserve your table for an unforgettable dining experience.
        </p>
      </section>

    </div>
     <Footer/>
      </>
  );
}
