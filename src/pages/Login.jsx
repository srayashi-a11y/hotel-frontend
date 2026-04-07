import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";
import "../styles/login.css";
import Header from "../components/Header";
import Footer from "../components/Footer";


function Login(){

 const navigate = useNavigate();

 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");

 const handleSubmit = async e=>{

  e.preventDefault();

  try{

   const res = await API.post("/auth/login",{
    email,
    password
   });

   localStorage.setItem("token",res.data.token);
   localStorage.setItem("user",JSON.stringify(res.data.user));

   Swal.fire({
    toast:true,
    position:"top-end",
    icon:"success",
    title:"Login Successful",
    showConfirmButton:false,
    timer:2000
   });

   setTimeout(()=>{

 const user = res.data.user;

 if(user.role === "admin"){
   navigate("/admin/dashboard");
 }else{
   navigate("/");
 }

},2000);

  }catch(err){

   Swal.fire({
    toast:true,
    position:"top-end",
    icon:"error",
    title:"Login Failed",
    showConfirmButton:false,
    timer:2000
   });

  }

 };

 return(
    <>
    <Header/>
  

 <div className="login-wrapper">

 <div className="login-card">

 <h2 className="login-title">Login</h2>

 <form onSubmit={handleSubmit}>

 <input
  type="email"
  placeholder="Email"
  className="form-control mb-3"
  onChange={e=>setEmail(e.target.value)}
 />

 <input
  type="password"
  placeholder="Password"
  className="form-control mb-3"
  onChange={e=>setPassword(e.target.value)}
 />

 <button className="login-btn">
 Login
 </button>
 <p className="auth-switch">
 Don't have an account?
 <Link to="/register"> Register</Link>
 </p>

 </form>

 </div>

 </div>
 <Footer/>
   </>

 );

}

export default Login;