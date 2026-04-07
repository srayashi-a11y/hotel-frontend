import { useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function EditBooking({ booking, onClose, refresh }) {

  const [form, setForm] = useState({
    firstName: booking.firstName,
    lastName: booking.lastName,
    email: booking.email,
    phone: booking.phone,
    checkIn: booking.checkIn?.slice(0,10),
    checkOut: booking.checkOut?.slice(0,10),
    rooms: booking.rooms,
    pricePerNight: booking.pricePerNight
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/bookings/${booking._id}`, form);

      Swal.fire("Updated!", "Booking updated successfully", "success");

      refresh();
      onClose();
    } catch (err) {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">

        <div className="booking-header">
          <h2 style={{ color: "#fff", textAlign: "center" }}>
            Edit Booking
          </h2>
          <span onClick={onClose} className="close-icon">&times;</span>
        </div>

        <div className="booking-body form-grid">

  <div className="form-group">
    <label>First Name</label>
    <input name="firstName" value={form.firstName} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Last Name</label>
    <input name="lastName" value={form.lastName} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Email</label>
    <input name="email" value={form.email} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Phone</label>
    <input name="phone" value={form.phone} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Check In</label>
    <input type="date" name="checkIn" value={form.checkIn} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Check Out</label>
    <input type="date" name="checkOut" value={form.checkOut} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Rooms</label>
    <input name="rooms" value={form.rooms} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label>Price / Night</label>
    <input name="pricePerNight" value={form.pricePerNight} onChange={handleChange} />
  </div>

</div>

        <div className="booking-footer">
          <button onClick={handleUpdate} style={{background:"#10b981"}}>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditBooking;