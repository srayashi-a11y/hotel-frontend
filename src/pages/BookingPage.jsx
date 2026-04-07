import {useLocation,useNavigate} from "react-router-dom"
import "../styles/bookingPage.css"
import Swal from "sweetalert2"
import {useState} from "react"
import roomAPI from "../services/roomAPI"

function BookingPage(){
  const [paymentMethod,setPaymentMethod] = useState("razorpay")
  const navigate = useNavigate()
  
const [form,setForm] = useState({
firstName:"",
lastName:"",
email:"",
phone:"",
countryCode:"+91",
bookingFor:"self",
// ✅ ADD THESE
  guestFirstName:"",
  guestLastName:"",
  guestEmail:"",
  guestPhone:"",
cardNumber:"",
expiry:"",
cvc:"",
cardName:"",

address:"",
city:"",
postalCode:"",
country:""
})
const {state} = useLocation()
const handleChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
})
}
const {
roomName,
roomImage,
checkIn,
checkOut,
rooms,
mealText,
cancelOption,
pricePerNight,
totalPrice
} = state || {}
const getNights = () => {
  const inDate = new Date(checkIn)
  const outDate = new Date(checkOut)

  const diffTime = outDate - inDate
  const nights = diffTime / (1000 * 60 * 60 * 24)

  return nights
}

const nights = getNights()
const subtotal = totalPrice * rooms * nights
const taxRate = 0.17
const taxAmount = subtotal * taxRate
const grandTotal = subtotal + taxAmount
const showTaxDetails = ()=>{

Swal.fire({

title:"Taxes and Fees",

html:`

<div style="text-align:left;font-size:14px">

<hr style="border:1px solid #ddd">

<p style="color:#555;margin:15px 0">
This mandatory amount covers government taxes, collected by us and paid to the hotel.
</p>

<div style="display:flex;justify-content:space-between;margin:10px 0">
<span>Government Tax</span>
<span>$${taxAmount.toFixed(2)}</span>
</div>

<hr style="border:1px solid #ddd">

<div style="display:flex;justify-content:space-between;font-weight:600;margin-top:10px">
<span>Total taxes and fees</span>
<span>$${taxAmount.toFixed(2)}</span>
</div>

</div>

`,

confirmButtonText:"Close",
confirmButtonColor:"#052b5f"

})

}

const handleBooking = async()=>{

if(paymentMethod==="razorpay"){
payWithRazorpay()
return
}

if(paymentMethod==="stripe"){
Swal.fire("Stripe will be added later")
}

}
const payWithRazorpay = async () => {
  try {

    const { data: order } = await roomAPI.post("/payment/create-order", {
      amount: grandTotal
    })

    const options = {
      key: "rzp_test_SDITVHEHAfb3JS",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "Hotel Booking",

      handler: async function (response) {

  const token = localStorage.getItem("token");

  await roomAPI.post("/payment/verify", {

    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,

    
    bookingData: {
  room: state.roomId || state._id,
  checkIn,
  checkOut,
  rooms,
  cancelOption,
  mealOption: mealText,   // ✅ ADD THIS LINE
  pricePerNight,
  taxAmount,
  taxRate,
  grandTotal,
  paymentMethod: "razorpay",

  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email,
  phone: form.phone,
  countryCode: form.countryCode,
  bookingFor: form.bookingFor,
  guestDetails: form.bookingFor === "someone_else" ? {
    firstName: form.guestFirstName,
    lastName: form.guestLastName,
    email: form.guestEmail,
    phone: form.guestPhone
  } : null,

  address: form.address,
  city: form.city,
  postalCode: form.postalCode,
  country: form.country
}

  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  Swal.fire({
  icon: "success",
  title: "Booking Confirmed",
  text: "Invoice will be sent to your email shortly"
}).then(() => {
    navigate(`/room/${state.roomId || state._id}`)
  })
}
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (err) {
    console.log("RAZORPAY ERROR:", err.response?.data || err.message)

    Swal.fire({
      icon: "error",
      title: "Payment Failed",
      text: err.response?.data?.error || "Something went wrong"
    })
  }
}

return(

<div className="booking-page">

<div className="booking-container">

{/* LEFT COLUMN */}

<div className="guest-box">

<div className="guest-header">
Basic Details
</div>

<div className="guest-body">

  <div className="row-two">

    <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        required
        />

        <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        required
        />

        </div>

        <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
        />

        <div className="phone-row">

        <select
        name="countryCode"
        value={form.countryCode}
        onChange={handleChange}
        required
        >

        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
        <option value="+91">🇮🇳 +91</option>
        <option value="+971">🇦🇪 +971</option>

        </select>

        <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        style={{width:"80%"}}
        required
        />

</div>

</div>


<div className="guest-body">
<div >
Who is the booking for?
</div>
<div className="radio-row">

<label className="radio-option">

<input
type="radio"
name="bookingFor"
value="self"
checked={form.bookingFor==="self"}
onChange={handleChange}
required
/>

<span>I am the main guest</span>

</label>

<label className="radio-option">

<input
type="radio"
name="bookingFor"
value="someone_else"
checked={form.bookingFor==="someone_else"}
onChange={handleChange}
required
/>

<span>Booking for someone else</span>

</label>
{/* ✅ SHOW ONLY IF BOOKING FOR SOMEONE ELSE */}


</div>
{form.bookingFor === "someone_else" && (
  <div className="guest-body">
    <div className="guest-header">Guest Details</div>

    <div className="row-two">
      <input
        type="text"
        name="guestFirstName"
        placeholder="Guest First Name"
        value={form.guestFirstName || ""}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="guestLastName"
        placeholder="Guest Last Name"
        value={form.guestLastName || ""}
        onChange={handleChange}
        required
      />
    </div>

    <input
      type="email"
      name="guestEmail"
      placeholder="Guest Email"
      value={form.guestEmail || ""}
      onChange={handleChange}
      required
    />

    <input
      type="tel"
      name="guestPhone"
      placeholder="Guest Phone"
      value={form.guestPhone || ""}
      onChange={handleChange}
      required
    />
  </div>
)}



</div>



<div className="guest-body">
<div className=" payment-header">

<div>Payment details</div>

<div className="secure-tag">
🔒 Fully encrypted
</div>

</div>
<div className="radio-row">

<label className="radio-option">

<input
type="radio"
name="paymentMethod"
value="razorpay"
checked={paymentMethod==="razorpay"}
onChange={(e)=>setPaymentMethod(e.target.value)}

/>

<span>Pay with Razorpay</span>

</label>

{/* <label className="radio-option">

<input
type="radio"
name="paymentMethod"
value="stripe"
checked={paymentMethod==="stripe"}
onChange={(e)=>setPaymentMethod(e.target.value)}
/>

<span>Pay with Stripe</span>

</label> */}

</div>

<h4 className="billing-title">Billing address</h4>

<input
type="text"
name="address"
placeholder="Address"
value={form.address}
onChange={handleChange}
required
/>

<input
type="text"
name="city"
placeholder="City"
value={form.city}
onChange={handleChange}
required
/>

<input
type="text"
name="postalCode"
placeholder="Postal code"
value={form.postalCode}
onChange={handleChange}
required
/>

<select
name="country"
value={form.country}
onChange={handleChange}
required
>

<option>Hong Kong</option>
<option>India</option>
<option>United States</option>
<option>United Kingdom</option>
<option>UAE</option>

</select>



</div>
<button
className="confirm-btn"
onClick={handleBooking}
>
Confirm Booking
</button>
</div>



{/* RIGHT COLUMN */}

<div className="booking-right">

<div className="booking-summary">

<div className="summary-header">
Booking Details
</div>

<div className="summary-body">

<p className="summary-dates">
{checkIn} - {checkOut}
</p>

<div className="summary-room">

<img src={roomImage} alt="" />

<div>
<p>{rooms} × {roomName}</p>
</div>

</div>

<p className="text">🛑 {cancelOption === "free" ? "Free cancellation" : "Non-refundable"}</p>
<p className="text">🍽 {mealText}</p>

<div className="summary-price">

<span>
${totalPrice}.00 × {rooms} rooms × {nights} nights
</span>

<b>
${subtotal.toFixed(2)}
</b>

</div>

<div className="price-dashed"></div>

<div className="summary-tax" onClick={showTaxDetails} style={{cursor:"pointer"}}>

<span>Tax and fees</span>

<span>
${taxAmount.toFixed(2)}
</span>

</div>

<div className="price-divider"></div>

<div className="summary-total">

<b>Total</b>

<b>
${grandTotal.toFixed(2)}
</b>

</div>

</div>

</div>

</div>

</div>

</div>

)

}

export default BookingPage