import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import Navbar from "../../components/navbar/Navbar";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const { email, password} = credentials
    try {
      const response = await axios.post("/login",{
        email,
        password
      })
      setCredentials({})
      toast.success("login Sucessfully!")
      navigate("/")
    } catch (error) {
      if(error.response.data.error){
        toast.error(error.response.data.error)
      } 
    }
    
  };


  return (
    <div>
      <Navbar />
      <div className="login">
      <div className="lContainer">
        <input
          type="text"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button onClick={handleClick} className="lButton">
          Login
        </button>
      </div>
    </div>
    </div>
  );
};

export default Login;
