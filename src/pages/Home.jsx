import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchForm from "./SearchForm";
import "../styles/home.css";

import roomAPI, { IMAGE_BASE_URL } from "../services/roomAPI";
import { useNavigate } from "react-router-dom";

function Home(){

   const [user,setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const reviewRef = useRef(null);
  const [activeReview, setActiveReview] = useState(0);

  // HERO SLIDER STATE
  const images = [
  "/images/homebg1.jfif",
  "/images/homebg2.jfif",
  "/images/homebg3.jfif"
];
  const dishes = [
  { img: "/images/dishi.jpg", name: "Grilled Salmon" },
  { img: "/images/dishii.jfif", name: "Classic Pasta" },
  { img: "/images/dishviii.jfif", name: "Mutton Special" },
  { img: "/images/dishiii.jfif", name: "Chicken Roast" },
  { img: "/images/dishiv.jfif", name: "Seafood Platter" },
  { img: "/images/dishv.jfif", name: "Veg Delight" },
  { img: "/images/dishvi.jfif", name: "BBQ Special" },
  { img: "/images/dishvii.jfif", name: "Dessert Special" },
];
 const galleryItems = [
 { img: "/images/gi1.webp", name: "Hotel image" },
  { img: "/images/gi2.webp", name: "Hotel image" },
  { img: "/images/gi3.jpg", name: "Hotel image" },
  { img: "/images/gi4.jfif", name: "Hotel image" },
  { img: "/images/gi5.jfif", name: "Hotel image" },
  { img: "/images/gi6.jpg", name: "Hotel image" },
];
const reviews = [
  {
    name: "Amit Sharma",
    img: "/images/user1.jpg",
    text: "Amazing experience! The rooms were luxurious and service was top-notch."
  },
  {
    name: "Priya Das",
    img: "/images/user2.jpg",
    text: "Loved the ambiance and food. Definitely coming back again!"
  },
  {
    name: "Rahul Verma",
    img: "/images/user3.jpg",
    text: "Best hotel stay ever. Everything was perfect from check-in to checkout."
  },
  {
    name: "Sneha Roy",
    img: "/images/user4.jpg",
    text: "Beautiful rooms and excellent hospitality. Highly recommended!"
  }
];

  const [current, setCurrent] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const getAmenityIcon = (amenity) => {
  const name = amenity.toLowerCase();

  if (name.includes("wifi")) return "📶";
  if (name.includes("ac")) return "❄️";
  if (name.includes("air")) return "❄️";
  if (name.includes("tv")) return "📺";
  if (name.includes("pool")) return "🏊";
  if (name.includes("spa")) return "🧘";
  if (name.includes("parking")) return "🚗";
  if (name.includes("breakfast")) return "🍳";
  if (name.includes("view")) return "🌆";
  if (name.includes("gym")) return "🏋️";

  return "✨"; // default icon
};

  useEffect(() => {

  // USER LOGIC
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  } else {
    setUser(null);
  }

  // HERO SLIDER LOGIC
  const slider = setInterval(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, 4000);

  // FETCH ROOMS
  const fetchRooms = async () => {
    try {
      const res = await roomAPI.get("/rooms");
      const availableRooms = res.data.filter(r => r.isAvailable);
      setRooms(availableRooms.slice(0, 4)); // limit for homepage
    } catch (err) {
      console.log(err);
    }
  };

  fetchRooms();
  // DISH AUTO SCROLL
const dishCarousel = document.querySelector(".dish-carousel");

const dishInterval = setInterval(() => {
  if (dishCarousel) {
    dishCarousel.scrollBy({ left: 300, behavior: "smooth" });

    // 🔁 RESET TO START
    if (
      dishCarousel.scrollLeft + dishCarousel.clientWidth >=
      dishCarousel.scrollWidth
    ) {
      dishCarousel.scrollTo({ left: 0, behavior: "smooth" });
    }
  }
}, 2500);


const reviewInterval = setInterval(() => {
  setActiveReview((prev) => (prev + 1) % reviews.length);
}, 3000);
  return () => {
  clearInterval(slider);
  clearInterval(dishInterval);   // ✅ ADD THIS
  clearInterval(reviewInterval); // ✅ already added
};

}, [reviewIndex]);

 return(

  <>
  <Header/>

  {/* 🔥 HERO SECTION */}
  
        <section className="hero">

        {images.map((img, index) => (
          <div
            key={index}
            className={`hero-slide ${index === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Experience Luxury Like Never Before</h1>
          <p>Stay. Relax. Repeat.</p>
          <SearchForm />
        </div>

      </section>
      <section className="sigexp-section">
        <h2 className="sigexp-title">✨ What Makes Us Special</h2>

        <div className="sigexp-grid">

          <div className="sigexp-card">
            <div className="sigexp-icon">🛎️</div>
            <h3>24/7 Premium Service</h3>
            <p>Our team is always ready to provide you with world-class hospitality anytime.</p>
          </div>

          <div className="sigexp-card">
            <div className="sigexp-icon">🌊</div>
            <h3>Infinity Pool</h3>
            <p>Relax in our stunning rooftop infinity pool with breathtaking views.</p>
          </div>

          <div className="sigexp-card">
            <div className="sigexp-icon">🍽️</div>
            <h3>Fine Dining</h3>
            <p>Enjoy gourmet cuisine prepared by top chefs in a luxurious setting.</p>
          </div>

          <div className="sigexp-card">
            <div className="sigexp-icon">🧘</div>
            <h3>Spa & Wellness</h3>
            <p>Rejuvenate your body and mind with our premium spa therapies.</p>
          </div>

        </div>
      </section>
      {/* 🔥 FEATURED ROOMS SECTION */}
      <section className="frooms-section">

        <h2 className="frooms-title">🛏️ Featured Rooms</h2>

        <div className="frooms-scroll">

            {rooms.slice(0, 4).map((room, index) => (

            <div
  key={room._id}
  className="froom-card"
  onClick={() => navigate(`/room/${room._id}`)}
>

  {/* IMAGE */}
  <div className="froom-img-wrap">
    <img
      src={`${IMAGE_BASE_URL}${room.roomImages[0]}`}
      alt={room.name}
    />

    {/* BADGE */}
    {index < 2 && <span className="froom-badge">Popular</span>}

    {/* PRICE TOP RIGHT (NEW) */}
   

    {/* OVERLAY */}
    <div className="froom-overlay">
  <button className="froom-view-btn">
    View Details
  </button>
</div>
  </div>

  {/* CONTENT */}
  <div className="froom-body">
    <h3>{room.name}</h3>

    <p className="froom-desc">
      {room.description.substring(0, 60)}...
    </p>

    {/* FEATURES */}
    <div className="froom-features">
      {room.amenities && room.amenities.slice(0, 4).map((item, i) => (
        <span key={i}>
          {getAmenityIcon(item)} 
        </span>
      ))}
    </div>
    {/* PRICE */}
    <div className="froom-price">
      ₹{room.pricePerNight} / night
    </div>
  </div>

</div>

          ))}

        </div>
        <div className="frooms-btn-wrap">
          <button 
            className="frooms-btn"
            onClick={() => navigate("/room")}
          >
            See More Rooms →
          </button>
        </div>

      </section>
      {/* 🔥 SIGNATURE DISHES SECTION */}
<section className="dish-carousel-section">
  <h2 className="frooms-title">🍽️ Signature Dishes</h2>

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


      {/* 🔥 TESTIMONIAL SECTION */}
<section className="review-section">

  <h2 className="review-title">💬 Guest Experience</h2>
  <div className="review-summary">
    ⭐ 4.8 / 5 from 1200+ guests
  </div>

 <div className="review-fade-wrapper">

    {reviews.map((r, i) => (
  <div
    key={i}
    className={`review-fade-slide ${
      i === activeReview ? "active" : ""
    }`}
  >
    <p className="review-big-text">
      “{r.text}”
    </p>

    <div className="review-user">
      <img src={r.img} alt={r.name} />
      <h4>{r.name}</h4>
      <span>⭐⭐⭐⭐⭐</span>
    </div>
  </div>
))}

  </div>

  {/* SUMMARY */}
  

</section>
<section className="rest-gallery">
        <h2 className="frooms-title">🎥 Discover Our Space</h2>
        <div className="gallery-grid">
          <img src="/images/gi1.webp" alt="" />
          <img src="/images/gi2.webp" alt="" />
         
        </div>
        <div className="gallery-grid1">
          
          <img src="/images/gi3.jpg" alt="" />
           <img src="/images/gi4.jfif" alt="" />
        </div>
        <div className="gallery-grid">
          <img src="/images/gi5.jfif" alt="" />
          <img src="/images/gi6.jpg" alt="" />
         
        </div>
      </section>
      {/* 🔥 HERO SECTION END */}

      {/* <div className="container mt-5">
        <h1>Dubai Hotel Booking</h1>

        <h4 className="mt-3">
          Welcome, {user ? user.name : "Guest"}
        </h4>
      </div> */}

      <Footer/>
    </>
  );
}

  

  


export default Home;