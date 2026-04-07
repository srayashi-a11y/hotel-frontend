import {useState, useRef} from "react";
import roomAPI from "../../services/roomAPI";
import Swal from "sweetalert2";

function AddRoom(){

 const [room,setRoom] = useState({
  name:"",
  description:"",
  pricePerNight:"",
  maxGuests:"",
  maxChildren:"",
  totalRooms:"",
  amenities:[],
  advancedFeatures:"",
  isAvailable:true
});
 const AMENITIES_LIST = [
"Air Conditioner",
"Cable TV",
"Wifi & Internet",
"Towels",
"Toiletries",
"Mini Bar",
"Balcony",
"Sea View",
"Breakfast Included",
"Room Service"
]

 const [images,setImages] = useState([]);
 const [errors,setErrors] = useState({});
 const fileInputRef = useRef(null);

 const handleChange = e =>{
  setRoom({...room,[e.target.name]:e.target.value})
 }
const validate = () => {

 let newErrors = {}

 if(!room.name.trim()){
  newErrors.name = "Room name is required"
 }

 if(!room.description.trim()){
  newErrors.description = "Description is required"
 }

 if(!room.pricePerNight){
  newErrors.pricePerNight = "Price is required"
 }

 if(!room.maxGuests){
  newErrors.maxGuests = "Max guests required"
 }

 if(room.amenities.length === 0){
 newErrors.amenities = "Select at least one amenity"
 }

 if(images.length === 0){
  newErrors.images = "At least one image required"
 }
 if(images.length > 5){
 newErrors.images = "Maximum 5 images allowed"
}
if(!room.totalRooms){
 newErrors.totalRooms = "Total rooms no are required"
}

 setErrors(newErrors)

 return Object.keys(newErrors).length === 0
}
const handleAmenityChange = (amenity) => {

 let updated = [...room.amenities]

 if(updated.includes(amenity)){
  updated = updated.filter(a => a !== amenity)
 }else{
  updated.push(amenity)
 }

 setRoom({...room, amenities: updated})

}
const removeImage = (index) => {

 const updatedImages = images.filter((_,i)=> i !== index)

 setImages(updatedImages)

 // clear file input display
 if(fileInputRef.current){
  fileInputRef.current.value = ""
 }

}
 const handleSubmit = async e =>{
 e.preventDefault()
 if(!validate()){
  return
 }

 const formData = new FormData()

 Object.keys(room).forEach(key=>{

 if(key === "amenities"){
  formData.append("amenities", room.amenities.join(","))
 }else{
  formData.append(key,room[key])
 }

})

 for(let i=0;i<images.length;i++){
  formData.append("roomImages",images[i])
 }

 try{

  await roomAPI.post("/rooms/add",formData)

  Swal.fire({
   icon:"success",
   title:"Room Added",
   text:"Room added successfully!",
   timer:2000,
   showConfirmButton:false
  })

  setRoom({
 name:"",
 description:"",
 pricePerNight:"",
 maxGuests:"",
 maxChildren:"",
 totalRooms:"",
 amenities:[],
 advancedFeatures:"",
 isAvailable:true
})

  setImages([])

 }catch(err){

  Swal.fire({
   icon:"error",
   title:"Error",
   text:"Failed to add room"
  })

  console.log(err)

 }

}

 return(

<div className="addroom-container">

<h2 className="addroom-title">Add New Room</h2>

<form className="addroom-form" onSubmit={handleSubmit}>

 <input
 name="name"
 placeholder="Room Name"
 value={room.name}
 onChange={handleChange}
/>

{errors.name && (
<p style={{color:"red"}}>{errors.name}</p>
)}

<textarea
 name="description"
 placeholder="Room Description"
 value={room.description}
 onChange={handleChange}
/>

{errors.description && (
<p style={{color:"red"}}>{errors.description}</p>
)}

<input
 name="pricePerNight"
 placeholder="Price"
 value={room.pricePerNight}
 onChange={handleChange}
/>

{errors.pricePerNight && (
<p style={{color:"red"}}>{errors.pricePerNight}</p>
)}

<input
 name="maxGuests"
 placeholder="Max Guest"
 value={room.maxGuests}
 onChange={handleChange}
/>

{errors.maxGuests && (
<p style={{color:"red"}}>{errors.maxGuests}</p>
)}
<input
 name="maxChildren"
 type="number"
 placeholder="Number of Children Allowed"
 value={room.maxChildren}
 onChange={handleChange}
/>
<input
 name="totalRooms"
 type="number"
 placeholder="Number of Rooms Available"
 value={room.totalRooms}
 onChange={handleChange}
/>

{errors.totalRooms && (
<p style={{color:"red"}}>{errors.totalRooms}</p>
)}
<div className="amenities-checkbox-group">

<h4>Select Amenities</h4>

<div className="amenities-grid">

{AMENITIES_LIST.map((item,index)=>(
<label key={index} className="amenity-checkbox">

<input
 type="checkbox"
 checked={room.amenities.includes(item)}
 onChange={()=>handleAmenityChange(item)}
/>

<span>{item}</span>

</label>
))}

</div>

</div>

{errors.amenities && (
<p style={{color:"red"}}>{errors.amenities}</p>
)}
<div className="advanced-features-box">

<h4>What’s included in this room?</h4>

<textarea
 name="advancedFeatures"
 placeholder="Type feature and press Enter for next point"
 value={room.advancedFeatures}
 onChange={handleChange}
 className="advanced-features-input"
/>

<p className="feature-hint">
Press Enter to add another feature
</p>

</div>

<input
 ref={fileInputRef}
 type="file"
 multiple
 onChange={(e)=>{

  const files = Array.from(e.target.files)

  const totalImages = images.length + files.length

  if(totalImages > 5){

   setErrors(prev => ({
    ...prev,
    images: "Maximum 5 images allowed"
   }))

   if(fileInputRef.current){
    fileInputRef.current.value = ""
   }

   return
  }

  setErrors(prev => ({
   ...prev,
   images:""
  }))

  setImages(prev => [...prev,...files])

  e.target.value = ""

 }}
/>

{errors.images && (
<p style={{color:"red"}}>{errors.images}</p>
)}

<div style={{marginTop:"10px"}}>

 {images.map((img,index)=>{

  const preview = URL.createObjectURL(img)

  return(

   <div
    key={index}
    style={{
     display:"inline-block",
     position:"relative",
     margin:"10px"
    }}
   >

    <img
     src={preview}
     alt="preview"
     style={{
      width:"120px",
      height:"90px",
      objectFit:"cover",
      borderRadius:"6px",
      border:"1px solid #ccc"
     }}
    />

    <button
     type="button"
     onClick={()=>removeImage(index)}
     style={{
      position:"absolute",
      top:"-8px",
      right:"-8px",
      background:"red",
      color:"#fff",
      border:"none",
      borderRadius:"50%",
      width:"22px",
      height:"22px",
      cursor:"pointer",
      fontWeight:"bold"
     }}
    >
     ×
    </button>

   </div>

  )

 })}

</div>

 <button className="addroom-btn">Add Room</button>

 </form>

 </div>

 )

}

export default AddRoom;