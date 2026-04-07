import {useState} from "react"
import roomAPI from "../services/roomAPI"
import { FaPhoneAlt } from "react-icons/fa"
import Swal from "sweetalert2"
import RoomOptionsPopup from "./RoomOptionsPopup"

function CheckAvailability({roomId,totalRooms,onClose}){

const today = new Date().toISOString().split("T")[0]

const [checkIn,setCheckIn] = useState("")
const [checkOut,setCheckOut] = useState("")
const [rooms,setRooms] = useState("")
const [message,setMessage] = useState("")
const [available,setAvailable] = useState(null)
const token = localStorage.getItem("token")
const [showOptions,setShowOptions] = useState(false)
const [roomData,setRoomData] = useState(null)
const fetchRoomData = async()=>{
 try{

  const res = await roomAPI.get(`/rooms/${roomId}`)

  setRoomData(res.data)

 }catch(err){
  console.log(err)
 }
}
const checkAvailability = async(e)=>{

 e.preventDefault()

 if(!rooms){

  Swal.fire({
   icon:"warning",
   title:"Enter number of rooms"
  })

  return
 }
 

 try{

  const res = await roomAPI.post(
  `/rooms/${roomId}/check-availability`,
  {
    checkIn,
    checkOut,
    rooms
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

  const availableRooms = res.data.availableRooms

  setAvailable(availableRooms)

  if(Number(rooms) > availableRooms){

   Swal.fire({
        icon:"warning",
        title:"Room Not Available",
        html: `
        <p>Sorry, we have only <b>${availableRooms}</b> rooms left.</p>

        <div style="margin-top:5px;font-size:16px;">
        📞 <b>+971 50 123 4567</b>
        </div>

        <div style="margin-top:5px;color:#555;">
        Call Us for More Information
        </div>
        `,
        confirmButtonText:"Close"
        })

   return

  }else{

 const token = localStorage.getItem("token")

 if(!token){

  Swal.fire({
   icon:"info",
   title:"Login Required",
   html:`
    <p>Please login first to continue booking.</p>

    <a href="/login" 
       style="
       display:inline-block;
       margin-top:10px;
       padding:10px 20px;
       background:#1f2937;
       color:white;
       text-decoration:none;
       border-radius:5px;">
       Login Now
    </a>
   `,
    showConfirmButton:false
    })

    return

    }

    await fetchRoomData()
    setShowOptions(true)

    }

 }catch(err){
  console.log(err)
 }

}

return(

<div className="availability-overlay">

<div className="availability-popup">

<button className="availability-close"  style={{top:"-11px", right:"4px"}} onClick={onClose}>
×
</button>

<h2>Check Room Availability</h2>

<form onSubmit={checkAvailability}>

<div className="availability-row">

<input
  type="date"
  value={checkIn}
  min={today}
  required
  onChange={(e) => {
    setCheckIn(e.target.value)

    // 🔥 reset checkout if invalid
    if (checkOut && e.target.value >= checkOut) {
      setCheckOut("")
    }
  }}
/>

<input
  type="date"
  value={checkOut}
  min={checkIn || today}   // 🔥 KEY FIX
  required
  onChange={(e)=>setCheckOut(e.target.value)}
/>

</div>

<input
type="number"
min="1"
value={rooms}
placeholder="Number of Rooms"
onChange={(e)=>setRooms(e.target.value)}
required
/>

<button className="availability-btn">
Check Availability
</button>

</form>

{message && (

<div className="availability-message">

<p>{message}</p>

{rooms > available && (

<div className="availability-phone">

<FaPhoneAlt/>
<span>+971 50 123 4567</span>

</div>

)}

</div>

)}

</div>
{showOptions && roomData && (

<RoomOptionsPopup
roomId={roomData._id}
roomName={roomData.name}
pricePerNight={roomData.pricePerNight}
roomImage={roomData.roomImages[0]}
rooms={rooms}
checkIn={checkIn}
checkOut={checkOut}
onClose={()=>setShowOptions(false)}
/>

)}
</div>

)

}

export default CheckAvailability