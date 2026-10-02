import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);

  const dispatch = useDispatch();

  // Jab tak feed aa rahi hai tab tak spinner dikhega (warna "No more users" flash hota)
  const [loading, setLoading] = useState(true);

  const getFeed = async () => {
    if (feed?.users?.length > 0) {
      setLoading(false);
      return; // If feed is already present in the store, do not fetch again
    }

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Remove user after Interested or Ignore
  const handleUserAction = (userId) => {
    dispatch(removeUserFromFeed(userId));
  };

  // Loading
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // check if feed is empty or not, if empty show a message, else show the user card
  if (!feed?.users?.length) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="card w-full max-w-sm border border-base-300 bg-base-200 shadow-xl">
          <div className="card-body items-center py-12 text-center">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl">
              👋
            </div>

            <h2 className="text-xl font-bold">No more users</h2>

            <p className="text-sm text-base-content/60">
              You've seen everyone available for now.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div key={feed.users[0]._id} className="card-enter w-full max-w-sm">
        <UserCard user={feed.users[0]} onAction={handleUserAction} />
      </div>

      <p className="mt-6 text-center text-sm text-base-content/50">
        Swipe right to connect, left to skip. Or use the buttons.
      </p>
    </div>
  );
};

export default Feed;