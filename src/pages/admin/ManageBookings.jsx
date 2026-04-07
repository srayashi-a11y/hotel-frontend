import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";
import ViewBooking from "./ViewBooking";
import EditBooking from "./EditBooking";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]); // ✅ selected IDs
  const [viewBooking, setViewBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10; // change as needed

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);// ✅ PAGINATION LOGIC
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  // ✅ SELECT ONE
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ✅ SELECT ALL
  const handleSelectAll = () => {
    if (selected.length === bookings.length) {
      setSelected([]);
    } else {
      setSelected(bookings.map((b) => b._id));
    }
  };
  const handleCheckout = async (id) => {
  const result = await Swal.fire({
    title: "Complete Checkout?",
    text: "Rooms will be freed and booking marked completed",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Checkout",
  });

  if (result.isConfirmed) {
    try {
      await API.put(`/bookings/checkout/${id}`);

      Swal.fire("Done!", "Checkout completed", "success");

      fetchBookings();
    } catch (err) {
      Swal.fire("Error", "Checkout failed", "error");
    }
  }
};

  // ✅ DELETE ONE
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Booking?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/bookings/${id}`);
        Swal.fire("Deleted!", "Booking deleted successfully", "success");
        fetchBookings();
      } catch (err) {
        Swal.fire("Error", "Failed to delete booking", "error");
      }
    }
  };

  // ✅ BULK DELETE
  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: `Delete ${selected.length} bookings?`,
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete All",
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(selected.map((id) => API.delete(`/bookings/${id}`)));

        Swal.fire("Deleted!", "Selected bookings deleted", "success");

        setSelected([]);
        fetchBookings();
      } catch (err) {
        Swal.fire("Error", "Bulk delete failed", "error");
      }
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (!bookings.length) return <p>No bookings found</p>;

  return (
    <div className="manage-booking-container">
      <h2 className="manage-booking-title">Manage Bookings</h2>

      {/* ✅ BULK DELETE BUTTON */}
      {selected.length > 0 && (
        <button
          onClick={handleBulkDelete}
          style={{
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            padding: "8px 15px",
            marginBottom: "15px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Delete Selected ({selected.length})
        </button>
      )}

      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selected.length === bookings.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>#</th>
              <th>Room</th>
              <th>Guest Name</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Price</th>
              <th>Action</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {currentBookings.map((b, idx) => ( 
              <tr
  key={b._id}
  className={
    b.paymentStatus === "refunded"
      ? "refund-row"
      : b.status === "completed"
      ? "completed-row"
      : ""
  }
>
                {/* ✅ ROW CHECKBOX */}
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(b._id)}
                    onChange={() => handleSelect(b._id)}
                  />
                </td>

                <td>{indexOfFirstBooking + idx + 1}</td>
                <td title={b.room?.name}>
                  {b.room?.name?.length > 20
                    ? b.room.name.slice(0, 20) + "..."
                    : b.room?.name}
                </td>
                <td>{b.firstName} {b.lastName}</td>
                <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                <td>₹{b.grandTotal}</td>

                <td>
                  {b.status === "completed" ? (
                    <button className="completed-btn" disabled>
                      Completed
                    </button>
                  ) : b.paymentStatus === "refunded" ? null : (   // ✅ ADD THIS LINE
                    <button
                      onClick={() => handleCheckout(b._id)}
                      style={{
                        marginRight: "5px",
                        borderRadius: "4px"
                      }}
                      className="checkout-btn"
                    >
                      Checkout
                    </button>
                  )}
                  <button
                    onClick={() => setEditBooking(b)}
                    style={{
                      background: "#f59e0b",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      marginRight: "5px",
                      borderRadius: "4px"
                    }}
                  >
                    Edit
                  </button>
                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => setViewBooking(b)}
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      marginRight: "5px",
                      borderRadius: "4px"
                    }}
                  >
                    View
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDelete(b._id)}
                    style={{
                      background: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                  {b.status === "cancelled" && b.paymentStatus !== "refunded" && (
                    <button
                      onClick={async () => {

                        const result = await Swal.fire({
                          title: "Process Refund?",
                          html: `
                            <p><b>Booking ID:</b> ${b._id}</p>
                            <p><b>Refund Amount:</b> ₹${b.refundAmount || b.grandTotal}</p>
                            <p style="color:red;">This action cannot be undone</p>
                          `,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#6a0dad",
                          cancelButtonColor: "#aaa",
                          confirmButtonText: "Yes, Refund"
                        });

                        if (result.isConfirmed) {
                          try {
                            await API.post(`/payment/refund/${b._id}`);

                            await Swal.fire({
                              title: "Refund Successful 💸",
                              text: "Amount refunded to customer",
                              icon: "success"
                            });

                            fetchBookings();

                          } catch (err) {
                            Swal.fire({
                              title: "Refund Failed ❌",
                              text: err.response?.data?.message || "Something went wrong",
                              icon: "error"
                            });
                          }
                        }

                      }}
                      style={{
                        background: "purple",
                        color: "#fff",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "5px",
                        marginLeft: "5px"
                      }}
                    >
                      Refund
                    </button>
                  )}
                </td>
                
                  <td>
                  <span className={`status ${b.paymentStatus}`}>
                    {b.paymentStatus}
                  </span>
                </td>
                
                <td>
                {b.paymentStatus === "refunded" ? (
                  <span className="status-badge cancelled">Refunded</span>
                ) : b.status === "completed" ? (
                  <span className="status-badge completed">Completed</span>
                ) : b.status === "cancelled" ? (
                  <span className="status-badge cancelled">Cancelled</span>
                ) : (
                  <span className="status-badge active">Active</span>
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ✅ PAGINATION BUTTONS */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                margin: "0 5px",
                padding: "6px 12px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: currentPage === i + 1 ? "#3498db" : "#ddd",
                color: currentPage === i + 1 ? "#fff" : "#000"
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      {viewBooking && (
  <ViewBooking
    booking={viewBooking}
    onClose={() => setViewBooking(null)}
  />

)}
{editBooking && (
  <EditBooking
    booking={editBooking}
    onClose={() => setEditBooking(null)}
    refresh={fetchBookings}
  />
)}
    </div>
  );
}

export default ManageBookings;