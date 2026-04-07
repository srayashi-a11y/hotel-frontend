import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import roomAPI, { IMAGE_BASE_URL } from "../services/roomAPI";
import Swal from "sweetalert2";
import "../styles/rooms.css"
import Header from "../components/Header";
import Footer from "../components/Footer";

function SearchRoom() {
  const [rooms, setRooms] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const adults = Number(params.get("adults"));

  // 🔥 COMBINATION FUNCTION
  const generateCombinations = (rooms, guests) => {
    let results = [];

    const helper = (remainingGuests, index, currentCombo) => {
      if (remainingGuests <= 0) {
        results.push([...currentCombo]);
        return;
      }

      if (index >= rooms.length) return;

      const room = rooms[index];

      const maxNeeded = Math.ceil(guests / room.maxGuests);

      for (let i = 0; i <= Math.min(room.availableRooms, maxNeeded); i++){
        if (i > 0) {
          currentCombo.push({
            name: room.name,
            count: i,
            capacity: room.maxGuests,
            roomId: room._id,
            available: room.availableRooms
          });
        }

        helper(
          remainingGuests - i * room.maxGuests,
          index + 1,
          currentCombo
        );

        if (i > 0) currentCombo.pop();
      }
    };

    helper(guests, 0, []);
    return results;
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomAPI.get(
          `/search?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`
        );

        const data = res.data.filter(r => r.availableRooms > 0);

        // ✅ STEP 1: direct match (BEST CASE)
        const directRooms = data.filter(
  r => r.maxGuests >= adults && r.availableRooms > 0
);

        let finalRooms = [...data]; // ✅ show ALL available rooms first

// highlight best ones separately if you want

        // ❌ STEP 2: combinations
        const combinations = generateCombinations(data, adults);

        let validCombos = combinations
          .map(combo => {
            const totalGuests = combo.reduce(
              (sum, r) => sum + r.count * r.capacity,
              0
            );

            const totalRoomsUsed = combo.reduce(
              (sum, r) => sum + r.count,
              0
            );

            const extraGuests = totalGuests - adults;

            return {
              combo,
              totalGuests,
              totalRoomsUsed,
              extraGuests
            };
          })
          .filter(c => c.totalGuests >= adults);

        // ✅ 🔥 SMART SORT (IMPORTANT)
        validCombos.sort((a, b) => {
          // 1️⃣ LESS ROOMS FIRST
          if (a.totalRoomsUsed !== b.totalRoomsUsed) {
            return a.totalRoomsUsed - b.totalRoomsUsed;
          }

          // 2️⃣ EXACT MATCH FIRST (no extra guests)
          if (a.extraGuests !== b.extraGuests) {
            return a.extraGuests - b.extraGuests;
          }

          return 0;
        });

        // ✅ LIMIT BEST ONLY
        validCombos = validCombos.slice(0, 5);

        if (validCombos.length === 0) {
          Swal.fire("No rooms available", "", "error");
          return;
        }

        const topCombos = validCombos.map(v => v.combo);

        let message = topCombos
          .map(combo =>
            combo
              .map(r => `${r.count} × ${r.name} (${r.capacity})`)
              .join(" + ")
          )
          .join("<br><br>");

        Swal.fire({
          title: "Best Room Options",
          html: message,
          icon: "info",
          confirmButtonText: "Continue"
        }).then(() => {
          const roomIds = new Set();

          topCombos.forEach(combo => {
            combo.forEach(r => roomIds.add(r.roomId));
          });

          setRooms(data);
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchRooms();
  }, [checkIn, checkOut, adults]);

  return (
  <>
    <Header />

    <div className="rooms-page">

      

      <div className="rooms-grid">

        {rooms.map((room) => (

          <div
            key={room._id}
            className="room-card"
            onClick={() => navigate(`/room/${room._id}`)}
          >

            <img
              src={`${IMAGE_BASE_URL}${room.roomImages[0]}`}
              alt={room.name}
            />

            <div className="room-card-body">

              <h3>{room.name}</h3>
              <div className="room-capacity">
              <span>👨‍👩‍👧Adults: {room.maxGuests} </span>
              <span> 🧒Children: {room.maxChildren || 0}</span>
            </div>

              <p>
                {room.description?.substring(0, 80)}...
              </p>

              <div className="room-card-footer">

                <span className="price">
                  ${room.pricePerNight} / night
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

    <Footer />
  </>
);
}

export default SearchRoom;