import { useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminSidebar({ setActive, active }) {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // ✅ toggle

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menu = [
    { key: "dashboard", label: "Dashboard" },
    { key: "add-room", label: "Add Room" },
    { key: "manage-rooms", label: "Manage Rooms" },
    { key: "bookings", label: "Bookings" },
    { key: "payments", label: "Payments" },
    // { key: "contact-messages", label: "Contact Messages" },
    { key: "add-blog", label: "Add Blog" },
    { key: "manage-blogs", label: "View Blog" },
    { key: "comments", label: "Comments & Messages" },
  ];

  return (
    <>
      {/* 🔥 HAMBURGER ICON (MOBILE) */}
      <div className="hamburger" onClick={() => setOpen(true)}>
        ☰
      </div>

      {/* 🔥 OVERLAY */}
      {open && <div  onClick={() => setOpen(false)}></div>}

      {/* 🔥 SIDEBAR */}
      <div className={`admin-sidebar ${open ? "open" : ""}`}>
        <h3 className="admin-title">Admin Panel</h3>

        {menu.map(item => (
          <button
            key={item.key}
            onClick={() => {
  if (active !== item.key) {
    setActive(item.key);
  }

  setTimeout(() => {
    setOpen(false);
  }, 150);
}}
            className={active === item.key ? "active-btn" : ""}
          >
            {item.label}
          </button>
        ))}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
}

export default AdminSidebar;