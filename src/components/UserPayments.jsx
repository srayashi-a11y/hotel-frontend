import { useEffect, useState } from "react";
import API from "../services/api";

function UserPayments() {
  const [payments, setPayments] = useState([]);

  // ✅ PAGINATION ADDED
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await API.get("/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setPayments(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ PAGINATION LOGIC ADDED
  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = payments.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  return (
    <div className="payment-container">

      <style>{`
        .payment-container {
          width: 100%;
          padding: 20px;
          overflow-x: auto; /* important for mobile scroll */
        }

        /* TABLE */
        .payment-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          min-width: 700px; /* prevents breaking */
        }

        /* HEADER */
        .payment-table thead {
          background: linear-gradient(90deg, #06b6d4, #3b82f6);
        }

        .payment-table th {
          padding: 15px;
          color: white;
          text-align: left;
          font-size: 14px;
        }

        /* BODY */
        .payment-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
          font-size: 14px;
        }

        .payment-table tbody tr:nth-child(even) {
          background: #f1f5f9;
        }

        .payment-table tbody tr:hover {
          background: #e0f2fe;
        }

        /* STATUS */
        .status {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .status.paid {
          background: #22c55e;
          color: white;
        }

        .status.refunded {
          background: #facc15;
          color: black;
        }

        .status.failed {
          background: #ef4444;
          color: white;
        }

        .no-data {
          margin-top: 20px;
          color: gray;
        }

        /* =========================
          🔥 MOBILE RESPONSIVE
        ========================= */

        @media (max-width: 768px) {

          .payment-container {
            padding: 10px;
          }

          h2 {
            font-size: 18px;
            text-align: center;
          }

          .payment-table {
            min-width: 600px; /* keep scroll instead of breaking */
          }

          .payment-table th,
          .payment-table td {
            padding: 10px;
            font-size: 12px;
          }
        }

        /* very small phones */
        @media (max-width: 480px) {

          .payment-table {
            min-width: 520px;
          }

          .payment-container {
            padding: 8px;
          }

          .status {
            font-size: 11px;
            padding: 4px 8px;
          }
        }
      `}</style>

      <h2>Payment History</h2>

      {payments.length === 0 ? (
        <p className="no-data">No payments found</p>
      ) : (
        <>
          <table className="payment-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment ID</th>
                <th>Method</th>
                <th>Status</th>
                <th>Refund</th>
              </tr>
            </thead>

            <tbody>
              {/* ✅ ONLY CHANGE HERE */}
              {currentPayments.map((p) => (
                <tr key={p._id}>
                  <td>{p._id}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>₹{p.grandTotal}</td>
                  <td style={{ fontSize: "12px" }}>
                    {p.razorpay_payment_id || "N/A"}
                  </td>
                  <td>{p.paymentMethod || "N/A"}</td>

                  <td>
                    <span className={`status ${p.paymentStatus}`}>
                      {p.paymentStatus}
                    </span>
                  </td>

                  <td>
                    {p.paymentStatus === "refunded"
                      ? `₹${p.refundAmount || 0}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
                  background: currentPage === i + 1 ? "#3b82f6" : "#fff",
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

export default UserPayments;