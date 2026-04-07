import {useState,useEffect} from "react"
import roomAPI, { IMAGE_BASE_URL }  from "../../services/roomAPI"
import Swal from "sweetalert2"

function EditRoom({room,onClose,onUpdated}){
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

 const [form,setForm]=useState({
  name:"",
  description:"",
  pricePerNight:"",
  maxGuests:"",
  maxChildren:"",
  totalRooms:"",
  amenities:[],
  advancedFeatures:""
 })

 const [images,setImages]=useState([])
 const [existingImages,setExistingImages] = useState([])
 const [imageError,setImageError] = useState("")

useEffect(()=>{

 setForm({
  name:room.name,
  description:room.description,
  pricePerNight:room.pricePerNight,
  maxGuests:room.maxGuests,
  maxChildren: room.maxChildren || "", 
  totalRooms:room.totalRooms ||[],
  amenities:room.amenities || [],
  advancedFeatures: room.advancedFeatures
  ? room.advancedFeatures.join("\n")
  : ""
 })

 setExistingImages(room.roomImages || [])

},[room])

 const handleChange=e=>{
  setForm({...form,[e.target.name]:e.target.value})
 }
// remove NEW uploaded image
const removeNewImage = (index) => {
 const updated = images.filter((_,i)=> i !== index)
 setImages(updated)
}

// remove EXISTING database image
const removeExistingImage = (index) => {
 const updated = existingImages.filter((_,i)=> i !== index)
 setExistingImages(updated)
}
    const handleAmenityChange = (amenity) => {

    let updated = [...form.amenities]

    if(updated.includes(amenity)){
    updated = updated.filter(a => a !== amenity)
    }else{
    updated.push(amenity)
    }

    setForm({...form, amenities:updated})

    }
 const handleSubmit=async e=>{
  e.preventDefault()

  const formData=new FormData()

  Object.keys(form).forEach(key=>{

    if(key === "amenities"){
    formData.append("amenities", form.amenities.join(","))
    }else{
    formData.append(key,form[key])
    }

    })
  formData.append("existingImages", JSON.stringify(existingImages))

  images.forEach(img=>{
   formData.append("roomImages",img)
  })

  try{

   await roomAPI.put(`/rooms/${room._id}`,formData)

   Swal.fire("Updated!","Room updated successfully","success")

   onUpdated()
   onClose()

  }catch(err){
   console.log(err)
  }

 }

 return(

<div className="modal-overlay">
   

<div className="modal-content">

<button
 type="button"
 onClick={onClose}
 className="modal-close-btn"
>
 ×
</button>

<h2>Edit Room</h2>

<form  className="addroom-form" onSubmit={handleSubmit}>

<label>Room Name</label>
<input
 name="name"
 value={form.name}
 onChange={handleChange}
/>

<label>Description</label>
<textarea
 name="description"
 value={form.description}
 onChange={handleChange}
/>

<label>Price Per Night</label>
<input
 name="pricePerNight"
 value={form.pricePerNight}
 onChange={handleChange}
/>

<label>Max Guests (Adults)</label>
<input
 name="maxGuests"
 value={form.maxGuests}
 onChange={handleChange}
/>

{/* ✅ NEW FIELD */}
<label>Max Children</label>
<input
 name="maxChildren"
 type="number"
 value={form.maxChildren}
 onChange={handleChange}
/>

<label>Total Rooms</label>
<input
 name="totalRooms"
 type="number"
 placeholder="Total Rooms Available"
 value={form.totalRooms}
 onChange={handleChange}
/>

<div className="amenities-checkbox-group">

<h4>Select Amenities</h4>

<div className="amenities-grid">

{AMENITIES_LIST.map((item,index)=>(
<label key={index} className="amenity-checkbox">

<input
 type="checkbox"
 checked={form.amenities.includes(item)}
 onChange={()=>handleAmenityChange(item)}
/>

<span>{item}</span>

</label>
))}

</div>

</div>
<div className="advanced-features-box">

<h4>What’s included in this room?</h4>

<textarea
 name="advancedFeatures"
 value={form.advancedFeatures}
 onChange={handleChange}
 placeholder="Type feature and press Enter for next bullet"
 className="advanced-features-input"
/>

<p className="feature-hint">
Press Enter to add another feature
</p>

</div>
<input
 type="file"
 multiple
 onChange={(e)=>{

  const files = Array.from(e.target.files)

  const totalImages =
   existingImages.length + images.length + files.length

  if(totalImages > 5){

   const allowed = 5 - existingImages.length - images.length

   if(allowed <= 0){
    setImageError("Maximum 5 images allowed. Remove some images first.")
   }else{
    setImageError(`You can only add ${allowed} more image(s)`)
   }

   e.target.value=""
   return
  }

  setImageError("")
  setImages(prev => [...prev,...files])

 }}
/>
{imageError && (
<p style={{color:"red",marginTop:"5px"}}>
{imageError}
</p>
)}
<div style={{marginTop:"10px"}}>

{existingImages.map((img,index)=>(
 
 <div
  key={index}
  style={{
   display:"inline-block",
   position:"relative",
   margin:"10px"
  }}
 >

 <img
  src={`${IMAGE_BASE_URL}${img}`}
  alt="room"
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
  onClick={()=>removeExistingImage(index)}
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

))}

</div>
<div>

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
  onClick={()=>removeNewImage(index)}
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
})
}
</div>

<div style={{marginTop:"15px",display:"flex",gap:"10px"}}>

<button className="addroom-btn" type="submit">
 Update Room
</button>

<button
 type="button"
 onClick={onClose}
 style={{
  background:"#6b7280",
  color:"#fff",
  border:"none",
  padding:"12px",
  borderRadius:"6px",
  cursor:"pointer"
 }}
>
 Cancel
</button>

</div>

</form>

</div>
</div>


 )

}

export default EditRoom