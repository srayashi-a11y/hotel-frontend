import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ PAGINATION ADDED
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    }
  }, [user]);

  const cancelBooking = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "Do you really want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await API.put(
        `/bookings/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      await Swal.fire({
        title: "Cancelled ✅",
        html: `
          <p>Your booking has been cancelled</p>
          <p><b>Refund Amount:</b> ₹${res.data.refundAmount}</p>
        `,
        icon: "success"
      });

      fetchBookings();

    } catch (err) {
      Swal.fire({
        title: "Error ❌",
        text: err.response?.data?.message || "Error cancelling booking",
        icon: "error"
      });
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get(`/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setBookings(res.data || []);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  // ✅ PAGINATION LOGIC ADDED
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div className="booking-container1 custom-booking-theme">

       <style>{`
/* ===== UNIQUE THEME WRAPPER ===== */
.custom-booking-theme {
  width: 100%;
  padding: 20px;
  background: #f8fafc; /* white background */
  min-height: 100vh;
  color: #0b1f3a;
}

/* TABLE WRAPPER */
.custom-booking-theme .table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
}

/* TABLE */
.custom-booking-theme .booking-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  table-layout: fixed;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

/* HEADER */
.custom-booking-theme .booking-table thead {
  background: linear-gradient(90deg, #0b1f3a, #1e3a8a); /* deep blue */
}

.custom-booking-theme .booking-table th {
  padding: 16px;
  text-align: left;
  color: #facc15; /* yellow text */
  font-weight: 700;
}

/* CELLS */
.custom-booking-theme .booking-table td {
  padding: 14px;
  border-bottom: 1px solid #e5e7eb;
  color: #0b1f3a;
}

/* ROW COLORS */
.custom-booking-theme .booking-table tbody tr:nth-child(even) {
  background: #f1f5f9;
}

.custom-booking-theme .booking-table tbody tr:nth-child(odd) {
  background: #ffffff;
}

/* HOVER */
.custom-booking-theme .booking-table tbody tr:hover {
  background: #e0f2fe;
  transition: 0.3s;
}

/* STATUS BADGES */
.custom-booking-theme .status {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

/* STATUS COLORS */
.custom-booking-theme .status.active {
  background: #22c55e;
  color: #fff;
}

.custom-booking-theme .status.pending {
  background: #facc15;
  color: #000;
}

.custom-booking-theme .status.completed {
  background: #3b82f6;
  color: #fff;
}

.custom-booking-theme .status.cancelled {
  background: #6b7280;
  color: #fff;
}

/* CANCEL BUTTON */
.custom-booking-theme button {
  transition: 0.3s;
}

.custom-booking-theme button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* NO BOOKING TEXT */
.custom-booking-theme .no-booking {
  margin-top: 20px;
  color: #1e3a8a;
}

/* MOBILE */
@media (max-width: 768px) {
  .custom-booking-theme {
    padding: 10px;
  }

  .custom-booking-theme .booking-table {
    min-width: 650px;
    font-size: 13px;
  }

  .custom-booking-theme th,
  .custom-booking-theme td {
    padding: 10px;
  }
}
  /* ===== MOBILE RESPONSIVE IMPROVEMENT (ADD ONLY) ===== */

@media (max-width: 768px) {
  .custom-booking-theme h2 {
    font-size: 18px;
  }

  .custom-booking-theme .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .custom-booking-theme .booking-table {
    min-width: 700px; /* keeps structure intact, enables horizontal scroll */
  }

  .custom-booking-theme th,
  .custom-booking-theme td {
    padding: 10px;
    font-size: 12px;
  }

  .custom-booking-theme button {
    padding: 5px 8px !important;
    font-size: 11px;
  }

  .custom-booking-theme .status {
    font-size: 10px;
    padding: 4px 10px;
  }
}

@media (max-width: 480px) {
  .custom-booking-theme {
    padding: 8px;
  }

  .custom-booking-theme .booking-table {
    min-width: 650px;
  }

  .custom-booking-theme th,
  .custom-booking-theme td {
    padding: 8px;
    font-size: 11px;
  }

  .custom-booking-theme h2 {
    font-size: 16px;
  }
}
`}</style>

      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="no-booking">No bookings found.</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Rooms</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Cancel Type</th>
                </tr>
              </thead>

              <tbody>
                {/* ✅ CHANGED ONLY HERE */}
                {currentBookings.map((b) => (
                  <tr key={b._id}>
                    <td title={b.room?.name}>
                        {b.room?.name?.length > 20
                          ? b.room.name.slice(0, 20) + "..."
                          : b.room?.name}
                      </td>
                    <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td>{b.rooms}</td>
                    <td>₹{b.grandTotal}</td>
                    <td>
                      <span className={`status ${b.status}`}>
                        {b.status}
                      </span>
                    </td>

                    <td>
                      {b.status === "active" ? (
                        <button
                          disabled={b.cancelOption === "non-refundable"}
                          onClick={() => cancelBooking(b._id)}
                          style={{
                            padding: "6px 10px",
                            background:
                              b.cancelOption === "non-refundable"
                                ? "gray"
                                : "red",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                        >
                          {b.cancelOption === "non-refundable"
                            ? "Not Allowed"
                            : "Cancel"}
                        </button>
                      ) : b.status === "cancelled" ? (
                        <span style={{ color: "#6b7280", fontWeight: "bold" }}>
                          Cancelled
                        </span>
                      ) : (
                        <span style={{ color: "#3b82f6", fontWeight: "bold" }}>
                          Completed
                        </span>
                      )}
                    </td>

                    <td>{b.cancelOption}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ PAGINATION UI ADDED */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  margin: "0 5px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: currentPage === i + 1 ? "#1e3a8a" : "#fff",
                  color: currentPage === i + 1 ? "#fff" : "#000",
                  cursor: "pointer"
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default UserBookings;