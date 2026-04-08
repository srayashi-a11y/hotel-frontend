import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails"
import BookingPage from "./pages/BookingPage"
import SearchRoom from "./pages/SearchRoom";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import CommentsPage from "./pages/admin/CommentsPage";
import AboutUs from "./pages/About";
import Restaurant from "./pages/Resturant";
import VerifyBooking from "./pages/VerifyBooking";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/room" element={<Rooms/>}/>
        <Route path="/room/:id" element={<RoomDetails/>} />
        <Route path="/booking" element={<BookingPage/>} />
        <Route path="/search" element={<SearchRoom />} />
        <Route
  path="/user/dashboard"
  element={
    <ProtectedRoute role="customer">
      <UserDashboard />
    </ProtectedRoute>
  }
/>
        {/* ADMIN */}
       <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs/>}/>
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/admin/comments" element={<CommentsPage />} />
        <Route path="/resturant" element={<Restaurant/>}/>
        <Route path="/verify-booking/:id" element={<VerifyBooking />} />
      </Routes>
              

    </BrowserRouter>
  );
}

export default App;