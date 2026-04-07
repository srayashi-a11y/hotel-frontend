import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/searchForm.css";

function SearchForm() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0]; // ✅ today's date

  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    // 🚨 extra validation
    if (!form.checkIn || !form.checkOut) {
      alert("Please select dates");
      return;
    }

    if (form.checkOut < form.checkIn) {
      alert("Check-out cannot be before check-in");
      return;
    }

    navigate(
      `/search?checkIn=${form.checkIn}&checkOut=${form.checkOut}&adults=${form.adults}`
    );
  };

  return (
    <div className="hero-search-container">
      <div className="hero-search-box">
        
        {/* ✅ Check In */}
        <div className="hero-search-field">
          <label>Check In</label>
          <input
            type="date"
            name="checkIn"
            min={today}  // 🔥 prevents past dates
            value={form.checkIn}
            onChange={handleChange}
          />
        </div>

        {/* ✅ Check Out */}
        <div className="hero-search-field">
          <label>Check Out</label>
          <input
            type="date"
            name="checkOut"
            min={form.checkIn || today} // 🔥 must be >= check-in
            value={form.checkOut}
            onChange={handleChange}
          />
        </div>

        {/* Guests */}
        <div className="hero-search-field">
          <label>Guests</label>
          <input 
            type="number" 
            name="adults" 
            min="1" 
            value={form.adults}
            onChange={handleChange} 
          />
        </div>

        <button className="hero-search-btn" onClick={handleSearch}>
          Search Rooms
        </button>

      </div>
    </div>
  );
}

export default SearchForm;