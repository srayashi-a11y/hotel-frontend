import {useEffect,useState} from "react"
import {useParams} from "react-router-dom"
import roomAPI, { IMAGE_BASE_URL } from "../services/roomAPI"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../styles/roomDetails.css"
import {
FaSnowflake,
FaTv,
FaWifi,
FaBath,
FaSoap,
FaGlassMartiniAlt,
FaUmbrellaBeach,
FaWater,
FaCoffee,
FaConciergeBell
} from "react-icons/fa"
import { FaPhoneAlt,FaUserFriends } from "react-icons/fa"
import CheckAvailability from "../components/CheckAvailability"


function RoomDetails(){

const {id} = useParams()

const [room,setRoom] = useState(null)
const [activeIndex,setActiveIndex] = useState(0)
const [activeTab,setActiveTab] = useState(1)
const [showAvailability,setShowAvailability] = useState(false)

const fetchRoom = async()=>{
 try{
  const res = await roomAPI.get(`/rooms/${id}`)
  setRoom(res.data)
  setReviews(res.data.reviews || [])
 }catch(err){
  console.log(err)
 }
}

useEffect(()=>{
 fetchRoom()
},[id])
const [reviews,setReviews] = useState([])
const [name,setName] = useState("")
const [rating,setRating] = useState(0)
const [comment,setComment] = useState("")
const amenityIcons = {
 "Air Conditioner": <FaSnowflake/>,
 "Cable TV": <FaTv/>,
 "Wifi & Internet": <FaWifi/>,
 "Towels": <FaBath/>,
 "Toiletries": <FaSoap/>,
 "Mini Bar": <FaGlassMartiniAlt/>,
 "Balcony": <FaUmbrellaBeach/>,
 "Sea View": <FaWater/>,
 "Breakfast Included": <FaCoffee/>,
 "Room Service": <FaConciergeBell/>
}
const submitReview = async(e)=>{

 e.preventDefault()

 try{

  const res = await roomAPI.post(`/rooms/${id}/review`,{
   name,
   rating,
   comment
  })

  setReviews(res.data)

  setName("")
  setRating(0)
  setComment("")

 }catch(err){
  console.log(err)
 }

}
/* auto carousel */
useEffect(()=>{

 if(!room || room.roomImages.length <= 1) return

 const interval = setInterval(()=>{

  setActiveIndex(prev =>
   prev === room.roomImages.length - 1 ? 0 : prev + 1
  )

 },3000)

 return ()=> clearInterval(interval)

},[room])


if(!room) return <p>Loading...</p>

return(
<>
<Header/>

<div className="innercontent">

<div className="container innercontent-main">

<div className="room-details-row">

{/* LEFT COLUMN */}

<div className="room-gallery">

{/* BIG IMAGE */}

<div className="room-main-image">

<img
 src={`${IMAGE_BASE_URL}${room.roomImages[activeIndex]}`}
 alt=""
/>

</div>


{/* THUMBNAILS */}

<div className="room-thumbnails">

{room.roomImages.map((img,index)=>(
<img
 key={index}
 src={`${IMAGE_BASE_URL}${img}`}
 alt=""
 className={`thumb-img ${index===activeIndex ? "active-thumb" : ""}`}
 onClick={()=>setActiveIndex(index)}
/>
))}

</div>

</div>


{/* RIGHT COLUMN (EMPTY FOR NOW) */}

{/* RIGHT COLUMN */}

<div className="room-info">

<h1 className="room-title">
 {room.name}
</h1>

<div className="room-price-box">



<div className="room-price">
 ₹ {room.pricePerNight}.00
 
</div>

</div>
<p className="room-description-text1">
{room.description}
</p>
<p className="guest-info">
  <FaUserFriends className="guest-icon" />
  <span>👨‍👩‍👧 Adults - </span>{room.maxGuests} ||
  <span>🧒 Children-</span> {room.maxChildren || 0}
</p>
{/* CONTACT + BOOK */}

<div className="room-book-section">
<p className="phone-desc">Call Us for More Information</p>
<div className="room-phone">
  <FaPhoneAlt className="phone-icon"/>

  <div className="phone-text">
    <span className="phone-number">+971 50 123 4567</span>
    
  </div>
</div>


<button
className="book-now-btn"
onClick={()=>setShowAvailability(true)}
>
Book Now
</button>

</div>
</div>

</div>

{/* ROOM DESCRIPTION ROW */}

{/* TABS SECTION */}

<div className="room-tabs-row">

<div className="room-tabs-header">

<button
 className={`room-tab-btn ${activeTab===1 ? "active-tab" : ""}`}
 onClick={()=>setActiveTab(1)}
>
Room Description
</button>

<button
 className={`room-tab-btn ${activeTab===2 ? "active-tab" : ""}`}
 onClick={()=>setActiveTab(2)}
>
Additional Info
</button>

</div>


<div className="room-tab-content">

{/* TAB 1 */}

{activeTab===1 && (

<div className="tab-inner">

<p className="room-description-text">
{room.description}
</p>

<div className="room-amenities">

<h4 >
Amenities
</h4>

<div className="amenities-grid">

{room.amenities && room.amenities.map((a,index)=>(

<div key={index} className="amenity-item">

<div className="amenity-icon">
{amenityIcons[a]}
</div>

<span>{a}</span>

</div>

))}

</div>

</div>
<h4 className="heading-li">What’s included in this room?</h4>
<ul className="advanced-features-list">

{room.advancedFeatures && room.advancedFeatures.map((f,index)=>(
<li key={index}>{f}</li>
))}

</ul>

</div>

)}


{/* TAB 2 */}

{activeTab===2 && (

<div className="tab-inner">

{/* REVIEWS CAROUSEL */}

<div className="reviews-row">

<div className="reviews-slider">

{reviews.map((r,index)=>(

<div key={index} className="review-card">

<div className="quote-mark">“</div>

<p className="review-text">
{r.comment}
</p>

<div className="review-stars">
{"⭐".repeat(r.rating)}
</div>

<div className="review-name">
— {r.name}
</div>

</div>

))}

</div>

</div>


{/* REVIEW FORM */}

<div className="review-form-row">

<h3>Add Your Review</h3>

<form onSubmit={submitReview} className="review-form">

<input
 type="text"
 placeholder="Your Name"
 value={name}
 onChange={(e)=>setName(e.target.value)}
 required
/>


<div className="rating-select">

{[1,2,3,4,5].map((star)=>(
<span
 key={star}
 className={`star ${rating>=star ? "active-star" : ""}`}
 onClick={()=>setRating(star)}
>
★
</span>
))}

</div>


<textarea
 placeholder="Write your review"
 value={comment}
 onChange={(e)=>setComment(e.target.value)}
 required
/>


<button type="submit" className="submit-review-btn">
Submit Review
</button>

</form>

</div>

</div>

)}

</div>

</div>
</div>

</div>
{showAvailability && (

<CheckAvailability
roomId={room._id}
totalRooms={room.totalRooms}
onClose={()=>setShowAvailability(false)}
/>

)}
<Footer/>
</>
)

}

export default RoomDetails