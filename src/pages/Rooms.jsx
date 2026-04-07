import {useEffect,useState} from "react"
import roomAPI, { IMAGE_BASE_URL }  from "../services/roomAPI"
import "../styles/rooms.css"
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Rooms(){

const [rooms,setRooms] = useState([])
const navigate=useNavigate();

const fetchRooms = async()=>{

 try{

  const res = await roomAPI.get("/rooms")

  // show only available rooms
  const availableRooms = res.data.filter(r => r.isAvailable)

  setRooms(availableRooms)

 }catch(err){
  console.log(err)
 }

}

useEffect(()=>{
 fetchRooms()
},[])

return(
    <>
    <Header/>

<div className="rooms-page">

<h2 className="rooms-title">Available Rooms</h2>

<div className="rooms-grid">

{rooms.map(room=>(

<div
 key={room._id}
 className="room-card"
 onClick={()=>navigate(`/room/${room._id}`)}
>

<img
 src={`${IMAGE_BASE_URL}${room.roomImages[0]}`}
 alt={room.name}
/>

<div className="room-card-body">

<h3>{room.name}</h3>

<p>
{room.description.substring(0,80)}...
</p>

              <span>👨‍👩‍👧Adults: {room.maxGuests} </span>
              <span> 🧒Children: {room.maxChildren || 0}</span>
            
<div className="room-card-footer">

<span className="price">
₹{room.pricePerNight} / night
</span>

<button className="book-btn">
Book Now
</button>

</div>

</div>

</div>

))}

</div>

</div>
<Footer/>
</>

)

}

export default Rooms