import { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AddRoom from "./AddRoom";
import ManageRooms from "./ManageRooms";
import "../../styles/admin.css";
import ManageBookings from "./ManageBookings";

import ContactMessages from "./ContactMessages";
import AddBlog from "./AddBlog";
import ManageBlogs from "./ManageBlogs";
import CommentsPage from "./CommentsPage";
import AdminPayments from "./AdminPayments";
import AdminCharts from "./AdminCharts";

function AdminDashboard(){

 const [active,setActive] = useState("dashboard");

 const user = JSON.parse(localStorage.getItem("user"));

 const renderContent = () => {
  switch (active) {
    case "add-room":
      return <AddRoom />;
    case "manage-rooms":
      return <ManageRooms />;
    case "bookings": // NEW CASE
      return <ManageBookings />;
    case "payments": // NEW CASE
      return <AdminPayments />;
      case "contact-messages":
        return <ContactMessages />;
      case "add-blog":
        return <AddBlog/>
      case "manage-blogs":
        return <ManageBlogs/>
      case "comments":
        return <CommentsPage/>
        case "dashboard":
  return (
    <>
      
      <AdminCharts />
    </>
  );
   
  }
};

 return(

 <div className="admin-layout">

  <AdminSidebar setActive={setActive} active={active} />

  <div className="admin-content">
   {renderContent()}
  </div>

 </div>

 )

}

export default AdminDashboard;