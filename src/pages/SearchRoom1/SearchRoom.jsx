import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import roomAPI, { IMAGE_BASE_URL } from "../services/roomAPI";
import Swal from "sweetalert2";

function SearchRoom() {
  const [rooms, setRooms] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const adults = Number(params.get("adults")); // ✅ convert to number

  // 🔥 ADVANCED COMBINATION FUNCTION
  const generateCombinations = (rooms, guests) => {
    let results = [];

    const helper = (remainingGuests, index, currentCombo) => {
      if (remainingGuests <= 0) {
        results.push([...currentCombo]);
        return;
      }

      if (index >= rooms.length) return;

      const room = rooms[index];

      // try 0 → max available rooms
      const maxNeeded = Math.ceil(guests / room.maxGuests);

for (let i = 0; i <= Math.min(room.totalRooms, maxNeeded); i++){
        if (i > 0) {
          currentCombo.push({
            name: room.name,
            count: i,
            capacity: room.maxGuests,
            roomId: room._id
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

        const data = res.data;

        // ✅ STEP 1: direct match
        const directRooms = data.filter(
            r => r.maxGuests >= adults && r.totalRooms > 0
            );

        if (directRooms.length > 0) {
          setRooms(directRooms);
          return;
        }

        // ❌ STEP 2: generate combinations
        const combinations = generateCombinations(data, adults);

        // ✅ valid combos
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

    return {
      combo,
      totalGuests,
      totalRoomsUsed
    };
  })
  .filter(c => c.totalGuests >= adults);

// ✅ sort by MIN rooms used
validCombos.sort((a, b) => a.totalRoomsUsed - b.totalRoomsUsed);

// take best only
validCombos = validCombos.slice(0, 5);

        if (validCombos.length === 0) {
          Swal.fire("No rooms available", "", "error");
          return;
        }

        // ✅ limit suggestions
        const topCombos = validCombos.map(v => v.combo);

        // 🎯 create message
        let message = topCombos
          .map(combo =>
            combo
              .map(r => `${r.count} × ${r.name} (${r.capacity})`)
              .join(" + ")
          )
          .join("<br><br>");

        // ✅ SHOW POPUP
        Swal.fire({
          title: "Suggested Room Combinations",
          html: message,
          icon: "info",
          confirmButtonText: "Continue"
        }).then(() => {
          // show all rooms used
          const roomIds = new Set();

          topCombos.forEach(combo => {
            combo.forEach(r => roomIds.add(r.roomId));
          });

          const filtered = data.filter(room =>
            roomIds.has(room._id)
          );

          setRooms(filtered);
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchRooms();
  }, [checkIn, checkOut, adults]);

  return (
    <div className="rooms-page">

      <h2>Search Results</h2>

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

            <h3>{room.name}</h3>
            <p>${room.pricePerNight} / night</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default SearchRoom;