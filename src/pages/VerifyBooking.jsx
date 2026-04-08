import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function VerifyBooking() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/verify/${id}`
        );
        setBooking(res.data.booking);
      } catch (err) {
        console.error(err);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  if (!booking)
    return (
      <h2 style={{ textAlign: "center", color: "red" }}>
        ❌ Invalid or Not Found Booking
      </h2>
    );

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      
      <h2 style={{ textAlign: "center" }}>✅ Booking Verified</h2>

      <hr />

      <p><b>Guest:</b> {booking.firstName} {booking.lastName}</p>
      <p><b>Email:</b> {booking.email}</p>
      <p><b>Room:</b> {booking.room?.name}</p>
      <p><b>Rooms:</b> {booking.rooms}</p>

      <p><b>Check-in:</b> {new Date(booking.checkIn).toDateString()}</p>
      <p><b>Check-out:</b> {new Date(booking.checkOut).toDateString()}</p>

      <p>
        <b>Status:</b>{" "}
        <span style={{ color: booking.status === "cancelled" ? "red" : "green" }}>
          {booking.status}
        </span>
      </p>

      <p>
        <b>Payment:</b>{" "}
        <span style={{ color: booking.paymentStatus === "refunded" ? "red" : "green" }}>
          {booking.paymentStatus}
        </span>
      </p>

      <p><b>Total Paid:</b> ₹{booking.grandTotal}</p>

    </div>
  );
}

export default VerifyBooking;