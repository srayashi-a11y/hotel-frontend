function ViewBooking({ booking, onClose }) {
  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">

        {/* HEADER */}
        <div className="booking-header">
          <h2 style={{ color: "#fff", textAlign: "center" }}>
            Booking Details
            </h2>
          <span onClick={onClose} className="close-icon">&times;</span>
        </div>

        {/* BODY */}
        <div className="booking-body">

          {/* SECTION 1 */}
          <div className="booking-section">
            <h4>Guest Info</h4>
            <p><strong>Name:</strong> {booking.firstName} {booking.lastName}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Phone:</strong> {booking.phone}</p>
          </div>
          {/* ✅ SECTION 1.5 - ACTUAL GUEST (ONLY IF AVAILABLE) */}
{booking.bookingFor === "someone_else" && booking.guestDetails && (
  <div className="booking-section">
    <h4>Guest (Staying Person)</h4>

    <p>
      <strong>Name:</strong>{" "}
      {booking.guestDetails.firstName} {booking.guestDetails.lastName}
    </p>

    <p>
      <strong>Email:</strong> {booking.guestDetails.email}
    </p>

    <p>
      <strong>Phone:</strong> {booking.guestDetails.phone}
    </p>
  </div>
)}

          {/* SECTION 2 */}
          <div className="booking-section">
            <h4>Booking Info</h4>
            <p><strong>Room:</strong> {booking.room?.name}</p>
            <p><strong>Check In:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
            <p><strong>Check Out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
            <p><strong>Rooms:</strong> {booking.rooms}</p>
          </div>

          {/* SECTION 3 */}
          <div className="booking-section">
            <h4>Options</h4>
            <p><strong>Meal:</strong> {booking.mealOption}</p>
            <p><strong>Cancellation:</strong> {booking.cancelOption}</p>
            <p><strong>Payment:</strong> {booking.paymentMethod}</p>
          </div>

          {/* SECTION 4 */}
          <div className="booking-section">
            <h4>Pricing</h4>
            <p><strong>Price/Night:</strong> ₹{booking.pricePerNight}</p>
            <p><strong>Tax:</strong> ₹{booking.taxAmount}</p>

            <div className="total-box">
              Total: ₹{booking.grandTotal}
            </div>
          </div>

          {/* ADDRESS */}
          <div className="booking-section full">
            <h4>Address</h4>
            <p>
              {booking.address}, {booking.city}, {booking.postalCode}, {booking.country}
            </p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="booking-footer">
          <button onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}

export default ViewBooking;