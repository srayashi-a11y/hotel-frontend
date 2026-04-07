import { useEffect, useState } from "react";
import API from "../../services/api";
import Swal from "sweetalert2";

function ContactMessages() {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const res = await API.get("/contact");
      setContacts(res.data);
    } catch (err) {
      console.log("Error fetching contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This message will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#90471a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/contact/${id}`);

        // remove from UI instantly
        setContacts(contacts.filter((c) => c._id !== id));

        Swal.fire("Deleted!", "Message has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete.", "error");
      }
    }
  };

  return (
    <div className="admin-content">

      <div className="table-container">
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th> {/* ✅ NEW */}
            </tr>
          </thead>

          <tbody>
            {contacts.length > 0 ? (
              contacts.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>{c.message}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>

                  {/* ✅ DELETE BUTTON */}
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No messages found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContactMessages;