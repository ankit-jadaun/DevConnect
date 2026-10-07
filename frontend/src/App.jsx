import { BrowserRouter, Route, Routes } from "react-router-dom";

import Body from "./components/Body.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Profile from "./components/Profile.jsx";
import { Provider } from "react-redux";
import reduxStore from "./utils/reduxStore.js";
import Feed from "./components/Feed.jsx";
import Connections from "./components/Connections.jsx";
import Requests from "./components/Request.jsx";
import Premium from "./components/Premium.jsx";
import Chat from "./components/Chat.jsx";

const App = () => {
  return (
    <>
    <Provider store={reduxStore}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Body />}>
               <Route index element={<Feed />} />
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<Signup />} />
               <Route path="/profile" element={<Profile />} />
               <Route path="/connections" element={<Connections />} />
               <Route path="/requests" element={<Requests />} />
               <Route path="/premium" element={<Premium />} />
               <Route path="/chat/:friendId" element={<Chat />} />

            </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
    </>
  );
};

export default App;