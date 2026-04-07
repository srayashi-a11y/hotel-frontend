import { useState } from "react"; 
import {Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";
import "../styles/register.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Register(){

 const navigate = useNavigate();

 const [form,setForm] = useState({
  name:"",
  email:"",
  password:"",
  image:null
 });

 const handleChange = e => {

  if(e.target.name === "image"){
   setForm({...form,image:e.target.files[0]});
  }else{
   setForm({...form,[e.target.name]:e.target.value});
  }

 };

 const handleSubmit = async e =>{

  e.preventDefault();

  const formData = new FormData();

  formData.append("name",form.name);
  formData.append("email",form.email);
  formData.append("password",form.password);
  formData.append("image",form.image);

  try{

   await API.post("/auth/register",formData,{
    headers:{
     "Content-Type":"multipart/form-data"
    }
   });

   Swal.fire({
    toast:true,
    position:"top-end",
    icon:"success",
    title:"Registration Successful",
    showConfirmButton:false,
    timer:2000
   });

   setTimeout(()=>{
    navigate("/login");
   },2000);

  }catch(err){

   Swal.fire({
    toast:true,
    position:"top-end",
    icon:"error",
    title: err.response?.data?.msg || "Error",
    showConfirmButton:false,
    timer:2000
   });

  }

 };

 return(
  <>
  <Header/>
  

 <div className="register-wrapper">

 <div className="register-card  mt-5">

 <h2 className="register-title">Register</h2>

 <form onSubmit={handleSubmit}>

 <input
  name="name"
  placeholder="Name"
  onChange={handleChange}
  className="form-control mb-3"
/>

<input
 name="email"
 placeholder="Email"
 onChange={handleChange}
 className="form-control mb-3"
/>

<input
 type="password"
 name="password"
 placeholder="Password"
 onChange={handleChange}
 className="form-control mb-3"
/>

<input
 type="file"
 name="image"
 onChange={handleChange}
 className="form-control mb-3"
/>

<button className="register-btn">
 Register
</button>
<p className="auth-switch">
 Already have an account?
 <Link to="/login"> Login</Link>
</p>
</form>

</div>

</div>
<Footer/></>
 );

}

export default Register;