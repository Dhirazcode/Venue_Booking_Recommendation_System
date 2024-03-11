import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../components/navbar/Navbar";
import BookingList from "../../components/booking/booking_list";
import { AdminContext } from "../../context/adminAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [venueData, setVenueData] = useState({});
  const { admin } = useContext(AdminContext);
  const param = admin?.admin_id;
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const formdata = new FormData();
  formdata.append("file", file);

  const handleUpload = async () => {
    try {
      const url = `/upload?param=${param}`;
      const response = await axios.post(url, formdata);
      setFile(null);
      toast.success("Uploaded Successfully!");
      navigate("/");
    } catch (error) {
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/get_venue?param=${param}`;
        const response = await axios.get(url);
        setVenueData(response.data || {}); // Provide a default empty object if response.data is falsy
      } catch (error) {
        console.log(error);
      }
    };

    if (param) {
      fetchData();
    }
  }, [param]);

  return (
    <div>
      <Navbar />
      {param && (
        <div className="table-container">
          <table className="venue-table">
            <thead>
              <tr>
                <th>Venue ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Upload Image</th>
              </tr>
            </thead>
            <tbody>
              <tr className="venue-row">
                <td>{venueData.venue_id || ""}</td> {/* Provide a default empty string if venueData.venue_id is falsy */}
                <td>{venueData.name || ""}</td> {/* Provide a default empty string if venueData.name is falsy */}
                <td>{venueData.address || ""}</td> {/* Provide a default empty string if venueData.address is falsy */}
                <td className="upload-cell">
                  <div className="file-input-container">
                    <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="file-input" />
                    <button onClick={handleUpload} className="upload-button">Upload</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <BookingList />
    </div>
  );
};

export default Home;
