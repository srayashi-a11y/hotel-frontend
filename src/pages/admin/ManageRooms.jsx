import {useEffect,useState} from "react"
import roomAPI, { IMAGE_BASE_URL }  from "../../services/roomAPI"
import Swal from "sweetalert2"
import EditRoom from "./EditRoom"
import ViewRoom from "./ViewRoom"

function ManageRooms(){

 const [rooms,setRooms]=useState([])
 const [editRoom,setEditRoom]=useState(null)
 const [viewRoom,setViewRoom]=useState(null)

 const fetchRooms = async()=>{

  try{
   const res = await roomAPI.get("/rooms")
   setRooms(res.data)
  }catch(err){
   console.log(err)
  }

 }
 const toggleStatus = async(room)=>{

 try{

  await roomAPI.put(`/rooms/${room._id}/status`,{
   isAvailable: !room.isAvailable
  })

  fetchRooms()

 }catch(err){
  console.log(err)
 }

 }
 const handleDelete = async(id)=>{

 const result = await Swal.fire({
  title:"Delete Room?",
  text:"This action cannot be undone",
  icon:"warning",
  showCancelButton:true,
  confirmButtonColor:"#d33",
  confirmButtonText:"Yes, Delete"
 })

 if(result.isConfirmed){

  try{

   await roomAPI.delete(`/rooms/${id}`)

   Swal.fire("Deleted!","Room deleted successfully","success")

   fetchRooms()

  }catch(err){
   console.log(err)
  }

 }

}

 useEffect(()=>{
  fetchRooms()
 },[])

 return(

 <div className="manage-room-container">

 <h2 className="manage-room-title">Manage Rooms</h2>

 <div className="room-table-wrapper">

 <table className="room-table">

 <thead>



<tr>
 <th>#</th>
 <th>Image</th>
 <th>Name</th>
 <th>Price</th>
 <th>Status</th>
 <th>Description</th>
 <th>Action</th>
</tr>


 </thead>

 <tbody>

 {rooms.map((room,index)=>(

 <tr key={room._id}>

  <td>{index+1}</td>

<td>
 {room.roomImages && room.roomImages.length > 0 && (
  <img
   src={`${IMAGE_BASE_URL}${room.roomImages[0]}`}
   alt={room.name}
   style={{
    width:"80px",
    height:"60px",
    objectFit:"cover",
    borderRadius:"5px"
   }}
  />
 )}
</td>

<td>{room.name}</td>

  <td>₹{room.pricePerNight}</td>
  <td>

  <label className="switch">

  <input
  type="checkbox"
  checked={room.isAvailable}
  onChange={()=>toggleStatus(room)}
  />

  <span className="slider"></span>

  </label>

  </td>

  <td>
   {room.description.substring(0,30)}...
  </td>
  <td>
    <button
 onClick={()=>setViewRoom(room)}
 style={{
  background:"#10b981",
  color:"#fff",
  border:"none",
  padding:"6px 10px",
  marginRight:"5px",
  borderRadius:"4px"
 }}
>
 View
</button>
    <button
 onClick={()=>setEditRoom(room)}
 style={{
  background:"#3498db",
  color:"#fff",
  border:"none",
  padding:"6px 10px",
  marginRight:"5px",
  borderRadius:"4px"
 }}
>
 Edit
</button>

<button
 onClick={()=>handleDelete(room._id)}
 style={{
  background:"#e74c3c",
  color:"#fff",
  border:"none",
  padding:"6px 10px",
  cursor:"pointer",
  borderRadius:"4px"
 }}
>
 Delete
</button>

</td>

 </tr>

 ))}

 </tbody>

 </table>
 {viewRoom && (
<ViewRoom
 room={viewRoom}
 onClose={()=>setViewRoom(null)}
/>
)}
 {editRoom && (
 <EditRoom
  room={editRoom}
  onClose={()=>setEditRoom(null)}
  onUpdated={fetchRooms}
/>
)}

 </div>

 </div>

 )

}

export default ManageRooms