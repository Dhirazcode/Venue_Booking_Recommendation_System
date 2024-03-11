import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/login/Signup";
import BookingPage from "./components/Booking/BookingPage";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/AuthContext";
import Bookedlist from "./pages/bookedlist/Bookedlist";
axios.defaults.baseURL = "http://localhost:8888";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
      <Toaster position='bottom-right' toastoptions={{duration:2000}} />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/booking" component={<BookingPage/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/viewbooked" element={<Bookedlist/>}/>
      </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
