import React from "react"
import  { IMAGE_BASE_URL }  from "../../services/roomAPI"

function ViewRoom({room,onClose}){

return(

<div className="modal-overlay">

<div className="viewroom-modal">

<button
 className="modal-close-btn"
 onClick={onClose}
>
×
</button>

<h2 className="viewroom-title">{room.name}</h2>

{/* Image Gallery */}

<div className="viewroom-images">

{room.roomImages.map((img,index)=>(

<img
 key={index}
 src={`${IMAGE_BASE_URL}${img}`}
 alt="room"
/>

))}

</div>


{/* Info Grid */}

<div className="viewroom-grid">

<div className="viewroom-card">
<span>Price</span>
<h3>₹{room.pricePerNight}</h3>
</div>

<div className="viewroom-card">
<span>Max Guest</span>
<h3>{room.maxGuests} + {room.maxChildren}</h3>
</div>
<div className="viewroom-card">
<span>Status</span>
<h3 className={room.isAvailable ? "available" : "notavailable"}>
{room.isAvailable ? "Available" : "Not Available"}
</h3>
</div>

<div className="viewroom-card">
<span>Rooms</span>
<h3>{room.totalRooms}</h3>
</div>





</div>


{/* Description */}

<div className="viewroom-section">

<h4>Description</h4>
<p>{room.description}</p>

</div>


{/* Amenities */}

<div className="viewroom-section">

<h4>Amenities</h4>

<div className="amenities-list">

{room.amenities.map((a,index)=>(

<span key={index} className="amenity-badge">
{a}
</span>

))}

</div>

</div>
{/* Advanced Features */}

<div className="viewroom-section">

<h4>What’s Included</h4>

<ul className="features-list">

{room.advancedFeatures && room.advancedFeatures.length > 0 ? (

room.advancedFeatures.map((feature,index)=>(
<li key={index}>{feature}</li>
))

) : (
<li>No additional features</li>
)}

</ul>

</div>

</div>

</div>

)

}

export default ViewRoom