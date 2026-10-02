import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice.js";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data.user));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUser();
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Saare pages isi ke andar khulte hain. Page ka background yahin se aata hai,
          isliye pages ko apna bg lagane ki zaroorat nahi. */}
      <main className="page-glow flex flex-1 flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Body;