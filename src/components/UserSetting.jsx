import { useState, useEffect } from "react";
import API from "../services/api";
import Swal from "sweetalert2";
import "../styles/usersetting.css"

function UserSetting() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = res.data || [];
      setBookings(data);

      const total = data.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
      setTotalAmount(total);

    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await API.put(
        "/auth/update-profile",
        { name, phone },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      Swal.fire("Success ✅", "Profile updated", "success");

    } catch (err) {
      Swal.fire("Error ❌", "Update failed", "error");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const res = await API.put(
        "/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      Swal.fire("Success ✅", res.data.message, "success");
      setCurrentPassword("");
      setNewPassword("");

    } catch (err) {
      Swal.fire("Error ❌", err.response?.data?.message, "error");
    }
  };

  return (
    <div className="settings-modern">

  <style>{`
    .settings-modern input {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      margin-top: 6px;
      transition: 0.2s;
    }

    .settings-modern input:focus {
      border-color: #111827;
      outline: none;
    }
  `}</style>


      {/* 👤 PROFILE */}
      <div className="section1">
        <h3>👤 Profile</h3>

        <div className="row">
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} />
          </div>

          <div className="field">
            <label>Phone</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </div>
        </div>

        <button className="primary" onClick={handleSave}>
          Save Profile
        </button>
      </div>

      {/* 🔐 SECURITY */}
      <div className="section1">
        <h3>🔐 Security</h3>

        <div className="row">
          <div className="field">
            <label>Current Password</label>
            <input type="password" value={currentPassword}
              onChange={(e)=>setCurrentPassword(e.target.value)} />
          </div>

          <div className="field">
            <label>New Password</label>
            <input type="password" value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)} />
          </div>
        </div>

        <button className="primary" onClick={handlePasswordChange}>
          Change Password
        </button>
      </div>

      {/* 🏨 STAY INSIGHTS */}
      <div className="section1">
        <h3>🏨 Stay Preferences (Insights)</h3>

        <p className="subtle">
          Your room and stay preferences are selected during booking.
          Based on your previous bookings, here are your usual choices:
        </p>

        <div className="insight">
          🛏️ Rooms booked usually:
          <b> {bookings[0]?.rooms || "N/A"} </b>
        </div>

        <div className="insight">
          🍽️ Meal Preference:
          <b> {bookings.find(b => b.mealOption)?.mealOption || "Not selected"} </b>
        </div>

        <div className="insight">
          📅 Average Stay:
          <b>
            {bookings.length > 0
              ? Math.round(
                  bookings.reduce((sum, b) => {
                    const days =
                      (new Date(b.checkOut) - new Date(b.checkIn)) /
                      (1000 * 60 * 60 * 24);
                    return sum + days;
                  }, 0) / bookings.length
                )
              : 0} nights
          </b>
        </div>

        <div className="insight1">
          💡 Tip: You can customize room type, bed preference, and more while booking each stay.
        </div>
      </div>

      {/* 💳 PAYMENT */}
      <div className="section1">
        <h3>💳 Payment & Cancellation Info</h3>

        <p className="subtle">
          Payment method and cancellation type are selected during booking.
          You can choose what works best for each stay.
        </p>

        <div className="insight">
          💡 Most of your bookings use:
          <b> {bookings.find(b => b.paymentMethod)?.paymentMethod || "N/A"} </b>
        </div>

        <div className="insight">
          🧾 Last Payment ID:
          <b> {bookings[0]?.razorpay_payment_id || "Not available"} </b>
        </div>

        <div className="insight">
          🔁 Cancellation Preference:
          <b> {bookings.find(b => b.cancelOption)?.cancelOption || "N/A"} </b>
        </div>

        <div className="insight2">
          ⚠️ Note: Payment and cancellation options may vary depending on hotel policies.
        </div>
      </div>

      {/* 📊 INSIGHTS */}
      <div className="section1">
        <h3>📊 Your Travel Insights</h3>

        <div className="insight">🏨 You booked <b>{bookings.length}</b> times</div>
        <div className="insight">💰 Total spent: ₹{totalAmount}</div>
        <div className="insight">⭐ Favorite: {bookings[0]?.room?.name || "N/A"}</div>
      </div>

      {/* ⚠️ DANGER */}
      <div className="section1"style={{borderBottom:"none !important"}}>

        <button
  className="danger"
  onClick={() => {
    Swal.fire({
      title: "Delete Account?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete("/auth/delete-account", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          Swal.fire("Deleted!", "Your account has been removed.", "success");

          window.location.href = "/login";
        } catch (err) {
          Swal.fire("Error", "Failed to delete account", "error");
        }
      }
    });
  }}
>
  Delete Account
</button>
      </div>

    </div>
  );
}

export default UserSetting;