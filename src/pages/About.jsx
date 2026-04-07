import React from "react";
import "../styles/about.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutUs() {
 return(
    <>
    <Header/>
  
    <div className="about-container">

      {/* HERO SECTION */}
      <section className="hero">
        
      </section>

      {/* SECTION 1 - STORY */}
      <section className="about-luxury-section">
  <div className="about-luxury-content">

    <div className="about-luxury-text">
      <span className="about-tag">Who We Are</span>

      <h2>Our Story</h2>

      <p>
        Established with a passion for hospitality, our hotel blends modern luxury
        with timeless elegance. Every corner reflects our commitment to excellence.
      </p>

      <p className="about-subtext">
        From personalized services to thoughtfully designed spaces, we ensure that
        every moment of your stay becomes a cherished memory.
      </p>

      <div className="about-line"></div>
    </div>

    <div className="about-luxury-image">
      <img src="/images/aboutus.jpg" alt="hotel" />
    </div>

  </div>
</section>

      {/* SECTION 2 - EXPERIENCE */}
     <section className="luxury-exp-section">

  <div className="luxury-exp-image">
    <img src="/images/ab.jpg" alt="room" />
  </div>

  <div className="luxury-exp-card">
    <span className="about-tag">Luxury Living</span>
    <h2>Luxury Experience</h2>
    <p>
      From elegantly designed rooms to world-class amenities, we redefine comfort.
      Every detail is crafted to provide unmatched sophistication and relaxation.
    </p>
    <div className="about-line"></div>
  </div>

</section>

      {/* SECTION 3 - SERVICES */}
      <section className="services">
        <span className="about-tag">WE OFFER</span>
        <h2>Our Services</h2>
        <div className="cards">
          <div className="card">
            <img src="/images/spa.jpg" />
            <h3>Spa & Wellness</h3>
          </div>
          <div className="card">
            <img src="images/fine.jpg" alt="food" />
            <h3>Fine Dining</h3>
          </div>
          <div className="card">
            <img src="/images/pool.jpg" alt="pool" />
            <h3>Infinity Pool</h3>
          </div>
          <div className="card">
            <img src="/images/gym.jpg" alt="gym" />
            <h3>Fitness Center</h3>
            </div>
        </div>
        <p
  style={{
    background: "rgba(255, 207, 139, 0.784);",
    marginTop:"35px",
    padding: "15px 20px",
    borderLeft: "4px solid #cf4c00;",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1.05rem",
    color: "#333",
    borderRadius: "6px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
  }}
>
  📞 +91 98765 43210 — Book your luxury escape today and experience comfort,
  elegance, and world-class hospitality.
</p>
      </section>
      

      {/* SECTION 4 - TESTIMONIAL */}
      <section className="testimonial">
        <h2>What Guests Say</h2>
        <p>
          “Absolutely stunning experience! The ambiance, service, and comfort were
          beyond expectations. Highly recommended for a luxurious stay.”
        </p>
      </section>

      {/* SECTION 5 - CTA */}
      <section className="cta">
        <h2>Book Your Stay Today</h2>
        <button>Explore Rooms</button>
      </section>

    </div>
  
 <Footer/>
   </>
  );
}
