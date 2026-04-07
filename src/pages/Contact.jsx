import { useState } from "react";
import API from "../services/api";
import "../styles/contact.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [msg, setMsg] = useState("");
const [isError, setIsError] = useState(false);

// handle input
const handleChange = (e) => {
  const { name, value } = e.target;

  // 📱 phone → allow only numbers
  if (name === "phone") {
    const onlyNums = value.replace(/[^0-9]/g, "");
    setForm({ ...form, phone: onlyNums });
  } else {
    setForm({ ...form, [name]: value });
  }
};

// submit
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/contact", form);

    setMsg(res.data.message);
    setIsError(false);

    setForm({
      name: "",
      phone: "",
      email: "",
      message: "",
    });

  } catch (err) {
    setMsg(err.response?.data?.message || "Error submitting form");
    setIsError(true);
  }
};

  return (
    <>
      <Header />

      <div className="innercontent">
        <div className="container innercontent-main contact-sec">
          <div className="row">

            {/* TOP BOXES */}
            <div className="contact-sec-top">

              <div className="contact-sec-top01">
                <div className="contact-sec-top-box">
                  <div className="contact-sec-top-box01">
                    <img src="/images/contact-icon01.png" alt="" />
                  </div>
                  <div className="contact-sec-top-box02">
                    <h5>
                      1141 Deadwood Ave, Suite 3 <br />
                      Rapid City, SD 57702
                    </h5>
                  </div>
                  <div className="clr"></div>
                </div>
              </div>

              <div className="contact-sec-top02">
                <div className="contact-sec-top-box">
                  <div className="contact-sec-top-box01">
                    <img src="/images/contact-icon02.png" alt="" />
                  </div>
                  <div className="contact-sec-top-box02">
                    <h5>
                      <strong>605-431-6294</strong> <br />
                      <strong>605-718-3757</strong>
                    </h5>
                  </div>
                  <div className="clr"></div>
                </div>
              </div>

              <div className="contact-sec-top03">
                <div className="contact-sec-top-box">
                  <div className="contact-sec-top-box01">
                    <img src="/images/contact-icon03.png" alt="" />
                  </div>
                  <div className="contact-sec-top-box02">
                    <h5>
                      <a href="mailto:sales@rarefindsdecor.com">
                        sales@rarefindsdecor.com
                      </a>
                    </h5>
                  </div>
                  <div className="clr"></div>
                </div>
              </div>

              <div className="clr"></div>
            </div>

            {/* FORM */}
            <form className="contact-sec-middle" onSubmit={handleSubmit}>
              <h2>Get In Touch</h2>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                required
              />

              <input type="submit" value="Submit" />

              {msg && (
                <p className={isError ? "message error" : "message success"}>
                    {msg}
                </p>
                )}

              <div className="clr"></div>
            </form>

            {/* MAP */}
            <div className="contact-sec-bottom">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3843.8637255697636!2d73.75562247416853!3d15.545434453249259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfea078228bd03%3A0xe5ef3539dd85e78d!2sCalangute%20Beach%20Rd%2C%20Calangute%2C%20Goa%20403516!5e0!3m2!1sen!2sin!4v1775116133261!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
 
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;