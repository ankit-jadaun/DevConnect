import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL } from "../utils/constants";
import { getSocket } from "../utils/socket";
import VerifiedBadge from "./VerifiedBadge";

// Route: /chat/:friendId
const Chat = () => {
  const { friendId } = useParams();
  const me = useSelector((store) => store.user);
  const navigate = useNavigate();

  const [friend, setFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  // Naya message aane par neeche tak scroll karne ke liye
  const bottomRef = useRef(null);

  // 1) Purane messages lao
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(BASE_URL + "/chat/" + friendId, {
          withCredentials: true,
        });

        setFriend(res.data.friend);
        setMessages(res.data.messages);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load the chat");
        navigate("/connections");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [friendId]);

  // 2) Live messages sunne ke liye socket
  useEffect(() => {
    if (!me?._id) return;

    const socket = getSocket();

    const handleMessage = (message) => {
      // Sirf isi conversation ka message add karo
      if (message.senderId === friendId || message.receiverId === friendId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleChatError = (errorMessage) => toast.error(errorMessage);

    socket.on("messageReceived", handleMessage);
    socket.on("chatError", handleChatError);

    return () => {
      socket.off("messageReceived", handleMessage);
      socket.off("chatError", handleChatError);
    };
  }, [friendId, me?._id]);

  // 3) Naya message aaye to neeche scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Message bhejo
  const handleSend = (e) => {
    e.preventDefault();

    const message = text.trim();
    if (!message) return;

    getSocket().emit("sendMessage", { friendId, text: message });
    setText("");
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-6">
      <div className="mx-auto flex h-[75vh] min-h-104 w-full max-w-3xl flex-col overflow-hidden rounded-box border border-base-300 bg-base-200 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-base-300 px-4 py-3">
          <button
            onClick={() => navigate("/connections")}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Back to connections"
          >
            ←
          </button>

          <div className="avatar">
            <div className="w-10 rounded-full">
              {friend?.photoUrl ? (
                <img src={friend.photoUrl} alt={friend.firstName} />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-neutral font-semibold text-neutral-content">
                  {friend?.firstName?.[0]}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <p className="flex items-center gap-1 font-semibold">
              <span className="truncate">
                {friend?.firstName} {friend?.lastName}
              </span>
              {friend?.isPremium && <VerifiedBadge className="h-4 w-4" />}
            </p>
            <p className="text-xs text-base-content/50">Connection</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-base-content/50">
              No messages yet. Say hi 👋
            </div>
          ) : (
            messages.map((message) => {
              const isMine = message.senderId === me?._id;

              return (
                <div
                  key={message._id}
                  className={`chat ${isMine ? "chat-end" : "chat-start"}`}
                >
                  <div
                    className={`chat-bubble max-w-[80%] wrap-break-word ${
                      isMine ? "chat-bubble-primary" : ""
                    }`}
                  >
                    {message.text}
                  </div>

                  <div className="chat-footer text-xs opacity-50">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        {/* Message box (connected users sab chat kar sakte hain) */}
        <form
          onSubmit={handleSend}
          className="flex gap-2 border-t border-base-300 p-3"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            className="input flex-1"
          />

          <button
            type="submit"
            disabled={!text.trim()}
            className="btn btn-primary"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;