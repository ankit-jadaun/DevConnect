// npm i socket.io-client
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

// Poore app mein ek hi socket (Body aur Chat dono yahi use karte hain).
// withCredentials se login wali cookie saath jaati hai.
export const getSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, { withCredentials: true });
  }
  return socket;
};

// Logout par connection band karne ke liye
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};