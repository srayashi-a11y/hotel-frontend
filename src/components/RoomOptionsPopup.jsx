import {useState} from "react"
import "../styles/roomOptions.css"
import {useNavigate} from "react-router-dom"
import { IMAGE_BASE_URL } from "../services/roomAPI"


function RoomOptionsPopup({
  roomId,
  roomName,
  pricePerNight,
  roomImage,
  rooms,
  checkIn,       // ✅ ADD
  checkOut,      // ✅ ADD
  onClose
}){
const navigate = useNavigate()
const [meal,setMeal] = useState(0)
const [cancel,setCancel] = useState(0)

const totalPrice = pricePerNight + meal + cancel

return(

<div className="roomoptions-overlay">

<div className="roomoptions-popup">

<button className="roomoptions-close" onClick={onClose}>
×
</button>

<h2 className="roomoptions-title">{roomName}</h2>

<hr/>

<h4 className="option-heading">Meal Options</h4>

<label className={`option-row ${meal===50 ? "active-option" : ""}`}>
<div className="option-left">
<input type="radio" name="meal" onChange={()=>setMeal(50)} />
<span>Breakfast included</span>
</div>
<span className="option-price">₹100.00</span>
</label>

<label className={`option-row ${meal===0 ? "active-option" : ""}`}>
<div className="option-left">
<input type="radio" name="meal" defaultChecked onChange={()=>setMeal(0)} />
<span>No breakfast</span>
</div>
<span className="option-price free">₹0.00</span>
</label>

<label className={`option-row ${meal===90 ? "active-option" : ""}`}>
<div className="option-left">
<input type="radio" name="meal" onChange={()=>setMeal(90)} />
<span>Breakfast & Dinner</span>
</div>
<span className="option-price">₹250.00</span>
</label>


<hr/>

<h4 className="option-heading">Cancellation</h4>

<label className={`option-row ${cancel===0 ? "active-option" : ""}`}>
<div className="option-left">
<input type="radio" name="cancel" defaultChecked onChange={()=>setCancel(0)} />
<span>Non-refundable</span>
</div>
<span className="option-price free">₹0.00</span>
</label>

<label className={`option-row ${cancel===10 ? "active-option" : ""}`}>
<div className="option-left">
<input type="radio" name="cancel" onChange={()=>setCancel(10)} />
<span>Free cancellation</span>
</div>
<span className="option-price">₹150.00</span>
</label>

<hr/>

<div className="roomoptions-bottom">

<div className="price-box">
<p>Total / Night</p>
<h2>${totalPrice}</h2>
</div>

<button
className="roomoptions-btn"
onClick={()=>{

navigate("/booking",{
state:{
    roomId,
roomName,
roomImage: IMAGE_BASE_URL + roomImage,

  checkIn,   // ✅ REAL DATE
  checkOut,  // ✅ REAL DATE

  rooms,

mealText: meal===50 ? "Breakfast included" :
meal===90 ? "Breakfast & Dinner included" :
"No meal",

cancelOption: cancel===10 ? "free" : "non-refundable",
cancelPrice: cancel,

pricePerNight,
totalPrice
}
})

}}
>
Continue ({rooms} Rooms)
</button>

</div>

</div>

</div>

)

}

export default RoomOptionsPopup