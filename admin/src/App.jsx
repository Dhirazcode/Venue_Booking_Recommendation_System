import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Login from "./pages/login/Login";
import Signup from "./pages/login/Signup";
import Add_venue from "./pages/login/Add_venue";
import Home from "./pages/home/Home";
import { AdminContextProvider } from "./context/adminAuthContext";
import { Toaster } from "react-hot-toast";
axios.defaults.baseURL = "http://localhost:8888";
axios.defaults.withCredentials = true;
function App() {
  return (
    <>
      <AdminContextProvider>
      <BrowserRouter>
      <Toaster position='bottom-right' toastoptions={{duration:2000}} />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login_admin" element={<Login/>}/>
        <Route path="/Signup_admin" element={<Signup/>}/>
        <Route path="/add_venue" element={<Add_venue/>}/>
      </Routes>
      </BrowserRouter>
    </AdminContextProvider>
    </>
  )
}

export default App
