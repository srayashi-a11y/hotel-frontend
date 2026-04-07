import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/userDashboard.css";
import UserBookings from "../components/UserBookings";
import UserPayments from "../components/UserPayments";
import UserProfile from "../components/UserProfile";
import API, { IMAGE_BASE_URL } from "../services/api";
import Swal from "sweetalert2";
import UserSetting from "../components/UserSetting";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = res.data || [];
      setBookings(data);

      const total = data.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
      setTotalAmount(total);
    } catch (err) {
      console.log(err);
    }
  };

  const activeBookings = bookings.filter((b) => b.status === "active");
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const avg = bookings.length ? (totalAmount / bookings.length).toFixed(0) : 0;
  const maxAmount = Math.max(...bookings.map(b => b.grandTotal || 0), 1);



  return (
    <div className="dashboard">

      {/* TOP BAR */}
      <div className="mobileTopBar">
        <button className="menuBtn" onClick={() => setSidebarOpen(true)}>☰</button>
        <div className="breadcrumb">Home / Dashboard</div>
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="userBox">
          <img src={`${IMAGE_BASE_URL}${user.image}`} alt="user" />
          <p>{user?.name}</p>
        </div>

        <ul>
          <li 
  className={activeTab === "dashboard" ? "active-tab" : ""}
  onClick={() => setActiveTab("dashboard")}
>
  Dashboard
</li>

<li 
  className={activeTab === "profile" ? "active-tab" : ""}
  onClick={() => setActiveTab("profile")}
>
  Profile
</li>

<li 
  className={activeTab === "bookings" ? "active-tab" : ""}
  onClick={() => setActiveTab("bookings")}
>
  My Bookings
</li>

<li 
  className={activeTab === "payments" ? "active-tab" : ""}
  onClick={() => setActiveTab("payments")}
>
  Payments
</li>

<li 
  className={activeTab === "settings" ? "active-tab" : ""}
  onClick={() => setActiveTab("settings")}
>
  Settings
</li>

          <li className="logout"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}>
            Logout
          </li>
        </ul>
      </div>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      {/* CONTENT */}
      <div className="content">

        {activeTab === "dashboard" && (
          <div className="dashboard-home">

            <h2 className="welcome-text">Welcome {user?.name} 👋</h2>

            {/* CARDS */}
            <div className="cards enhanced-cards">

              <div className="card glass blue">
                <p>Total Bookings</p>
                <h3>{bookings.length}</h3>
              </div>

              <div className="card glass green">
                <p>Active</p>
                <h3>{activeBookings.length}</h3>
              </div>

              <div className="card glass purple">
                <p>Total Spend</p>
               <h3>₹{Number(totalAmount).toFixed(2)}</h3>
              </div>

              <div className="card glass orange">
                <p>Average</p>
                <h3>₹{avg}</h3>
              </div>

              <div className="card glass red">
                <p>Completed</p>
                <h3>{completed.length}</h3>
              </div>

              <div className="card glass sky">
                <p>Cancelled</p>
                <h3>{cancelled.length}</h3>
              </div>

            </div>

            {/* 📊 DUAL GRAPH SECTION */}
<div className="graph-row">

  {/* GRAPH 1 */}
  {/* 📊 BAR GRAPH (CLEAR VERSION) */}
<div className="graph-box">
  <h3>💰 Spending Trend</h3>

  <div className="graph-scroll">
  <div className="graph">
    {bookings.slice(0, 10).map((b, i) => {

  const status = b.status?.toLowerCase().trim();

  const color =
    status === "active"
      ? "#22c55e"
      : status === "cancelled"
      ? "#ef4444"
      : "#6b7280";

  return (
    <div key={i} className="bar-wrapper">

      <span className="bar-value">₹{b.grandTotal || 0}</span>

      <div
        className="bar"
        style={{
          height: `${(b.grandTotal / maxAmount) * 170}px`, // ✅ FIXED
          background: color
        }}
      />

      <span className="bar-label">{i + 1}</span>

      <div className="tooltip">
        <h4>Booking #{i + 1}</h4>
        <p><strong>Amount:</strong> ₹{b.grandTotal || 0}</p>
        <p><strong>Status:</strong> {b.status}</p>
      </div>

    </div>
  );
})}
  </div>
</div>
</div>

  {/* GRAPH 2 */}
  {/* 📊 CIRCLE GRAPH */}
<div className="graph-box">
  <h3>📅 Booking Status</h3>

  <div className="ring-box">
    <div className="ring">
      {bookings.length}
    </div>

    <div className="ring-labels">
      <p>🟢 Active: {activeBookings.length}</p>
      <p>🔴 Cancelled: {cancelled.length}</p>
      <p>⚫ Completed: {completed.length}</p>
    </div>
  </div>
</div>

</div>

            {/* 💡 INSIGHT */}
            <div className="insight-box">
              {activeBookings.length > 2
                ? "🔥 You are a frequent traveler!"
                : "💡 Try more bookings for discounts"}
            </div>

          </div>
        )}

        {activeTab === "profile" && <UserProfile />}
        {activeTab === "bookings" && <UserBookings />}
        {activeTab === "payments" && <UserPayments />}
        {activeTab === "settings" && <UserSetting />}
      </div>
    </div>
  );
}

export default UserDashboard;