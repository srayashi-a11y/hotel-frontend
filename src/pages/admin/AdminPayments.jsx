import { useEffect, useState } from "react";
import roomAPI from "../../services/roomAPI";
import "../../styles/admin.css";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const paymentsPerPage = 10; // you can change
// PAGINATION LOGIC
const indexOfLast = currentPage * paymentsPerPage;
const indexOfFirst = indexOfLast - paymentsPerPage;
const currentPayments = payments.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(payments.length / paymentsPerPage);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await roomAPI.get("/payment/payments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPayments(data);
    } catch (err) {
      console.log(err);
    }
  };
  const downloadInvoice = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await roomAPI.get(`/payment/invoice/${id}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="admin-table-container">
      <h2>All Payments</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User</th>
            <th>Room</th>
            <th>Amount</th>
            <th>Payment ID</th>
            <th>Status</th>
            <th>Date</th>
            <th>Invoice</th>
          </tr>
        </thead>

        <tbody>
          {currentPayments.map((p) => (
            <tr key={p._id}>
              <td>{p.bookingId || p._id}</td>
              <td>{p.user?.name}</td>
              <td>{p.room?.name}</td>
              <td>₹{p.grandTotal}</td>
              <td>{p.razorpay_payment_id}</td>

              <td>
                <span className={`status ${p.paymentStatus}`}>
                  {p.paymentStatus}
                </span>
              </td>

              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td>
            {(p.paymentStatus === "paid" || p.paymentStatus === "refunded") && (
                <button
                onClick={() => downloadInvoice(p._id)}
                style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
                >
                Download
                </button>
            )}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
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
        background: currentPage === i + 1 ? "#052b5f" : "#ddd",
        color: currentPage === i + 1 ? "#fff" : "#000"
      }}
    >
      {i + 1}
    </button>
  ))}
</div>
    </div>
  );
}

export default AdminPayments;