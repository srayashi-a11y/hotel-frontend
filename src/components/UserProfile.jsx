import { useState } from "react";
import API  from "../services/api";
import Swal from "sweetalert2";
import { IMAGE_BASE_URL } from "../services/api";

function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [image, setImage] = useState(null);

  const handleUpdate = async () => {
    try {
      if (phone && !/^[0-9]{10}$/.test(phone)) {
        return Swal.fire("Error", "Enter valid 10 digit phone", "error");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (image) formData.append("image", image);

      const res = await API.put("/auth/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      Swal.fire("Updated ✅", "Profile updated successfully", "success");

    } catch (err) {
      Swal.fire("Error ❌", "Update failed", "error");
    }
  };

  return (
    <div className="profile-page">

      {/* ✅ INTERNAL CSS */}
      <style>{`
            .profile-page {
        padding: 30px;
        background: #f8fafc;
        min-height: 100vh;
      }

      /* CARD */
      .profile-card {
        max-width: 900px;
        margin: auto;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        overflow: hidden;
      }

      /* HEADER */
      .profile-header {
        background: linear-gradient(135deg, #0b1f3a, #1e3a8a);
        color: #fff;
        padding: 30px;
        text-align: center;
      }

      .profile-header img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 3px solid #facc15;
        object-fit: cover;
      }

      .profile-header h2 {
        margin-top: 10px;
      }

      /* BODY */
      .profile-body {
        padding: 25px;
      }

      /* FORM */
      .form-group {
        margin-bottom: 18px;
      }

      .form-group label {
        font-weight: 600;
        color: #0b1f3a;
      }

      .form-group input {
        width: 100%;
        padding: 10px;
        margin-top: 6px;
        border-radius: 8px;
        border: 1px solid #ddd;
        font-size: 14px;
      }

      /* GRID */
      .profile-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      /* BUTTON */
      .update-btn {
        margin-top: 20px;
        padding: 10px 18px;
        background: linear-gradient(135deg, #facc15, #f59e0b);
        color: #000;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        width: auto;
      }

      /* =======================
        🔥 RESPONSIVE DESIGN
      ======================= */

      /* Tablet */
      @media (max-width: 768px) {

        .profile-page {
          padding: 15px;
        }

        .profile-card {
          border-radius: 12px;
        }

        .profile-grid {
          grid-template-columns: 1fr; /* stack */
          gap: 12px;
        }

        .profile-header {
          padding: 20px;
        }

        .profile-header img {
          width: 75px;
          height: 75px;
        }

        .profile-body {
          padding: 18px;
        }

        .update-btn {
          width: 100%; /* full button */
        }
      }

      /* Mobile small */
      @media (max-width: 480px) {

        .profile-page {
          padding: 10px;
        }

        .profile-header h2 {
          font-size: 18px;
        }

        .form-group input {
          font-size: 13px;
          padding: 9px;
        }

        .update-btn {
          font-size: 14px;
        }
      }
      `}</style>

      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
          <img
            src={`${IMAGE_BASE_URL}${user.image}`}
            alt="user"
          />
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>

        {/* BODY */}
        <div className="profile-body">

          <div className="profile-grid">

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email (readonly)</label>
              <input type="text" value={email} disabled />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

          </div>

          <button className="update-btn" onClick={handleUpdate}>
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}

export default UserProfile;