import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice.js";
import { addRequests } from "../utils/requestsSlice.js";
import { getSocket, disconnectSocket } from "../utils/socket.js";
import { toast } from "sonner";
import SuperLikeToast from "./SuperLikeToast.jsx";

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

  // Pending requests lao aur Redux mein daalo (Navbar ka count isi se aata hai)
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieved", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.connectionRequest));
      return res.data.connectionRequest;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Login ke baad: pending Super Likes ka summary + live notifications ke liye socket
  useEffect(() => {
    if (!userData?._id) return;

    // 1) Pehle se aaye hue Super Likes ka summary
    fetchRequests().then((requests) => {
      const superLikes = requests.filter((request) => request.isSuperLike).length;

      if (superLikes > 0) {
        toast(`You have ${superLikes} new Super Like${superLikes > 1 ? "s" : ""} ★`, {
          id: "superlike-summary", // dobara chale to duplicate toast na bane
          description: "Someone really wants to connect with you.",
          action: { label: "View", onClick: () => navigate("/requests") },
        });
      }
    });

    // 2) Live notification: koi abhi Super Like kare to turant dikhao
    const socket = getSocket();

    socket.on("superLikeReceived", ({ from }) => {
      toast.custom(
        (id) => (
          <SuperLikeToast
            person={from}
            onView={() => {
              toast.dismiss(id);
              navigate("/requests");
            }}
            onClose={() => toast.dismiss(id)}
          />
        ),
        { duration: 8000 }
      );

      fetchRequests(); // Navbar ka count aur Requests page update ho jaye
    });

    // 3) Naya chat message aaye aur us chat ka page khula na ho to notification dikhao
    socket.on("messageReceived", (message) => {
      if (message.senderId === userData._id) return; // apna bheja hua message
      if (window.location.pathname === `/chat/${message.senderId}`) return; // chat pehle se khuli hai

      toast(`${message.sender?.firstName || "Someone"} sent you a message`, {
        description: message.text.slice(0, 60),
        action: {
          label: "Open",
          onClick: () => navigate(`/chat/${message.senderId}`),
        },
      });
    });

    // Logout par ya page band hone par connection band
    return () => disconnectSocket();
  }, [userData?._id]);

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