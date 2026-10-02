import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addRequests, removeRequest } from "../utils/requestsSlice";

const Requests = () => {
  const requests = useSelector((store) => store.request);

  const dispatch = useDispatch();

  // Loading skeleton dikhane ke liye
  const [loading, setLoading] = useState(true);

  // Fetch Requests
  const fetchRequests = async () => {
    if (requests.length > 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieved", {
        withCredentials: true,
      });

      // Store requests in Redux
      dispatch(addRequests(res.data.connectionRequest));
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch connection requests."
      );
    } finally {
      setLoading(false);
    }
  };

  // Review Connection Request
  const reviewRequest = async (status, requestId) => {
    try {
      const res = await axios.post(
        BASE_URL + `/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      // Remove reviewed request from Redux
      dispatch(removeRequest(requestId));

      toast.success(
        res.data.message ||
          `Connection request ${status} successfully`
      );
    } catch (error) {
      console.error("Error reviewing request:", error);
      toast.error(
        error.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    }
  };

  // Fetch requests when component loads
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex-1 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Connection Requests{" "}
            {requests.length > 0 && (
              <span className="badge badge-primary badge-soft align-middle">
                {requests.length}
              </span>
            )}
          </h1>
          <p className="mt-2 text-sm text-base-content/60">
            People who want to connect with you on DevConnect
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton h-96 w-full" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          /* Empty state */
          <div className="card mx-auto max-w-md border border-base-300 bg-base-200 shadow-xl">
            <div className="card-body items-center py-12 text-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl">
                👋
              </div>
              <h2 className="text-lg font-semibold">No requests yet</h2>
              <p className="text-sm text-base-content/60">
                You don't have any connection requests right now.
              </p>
            </div>
          </div>
        ) : (
          /* Requests List */
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div
                key={request._id}
                className="group card overflow-hidden border border-base-300 bg-base-200 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                {/* Profile Image */}
                <figure className="relative h-64">
                  {request.fromUserId?.photoUrl ? (
                    <img
                      src={request.fromUserId.photoUrl}
                      alt={`${request.fromUserId?.firstName || "User"} ${request.fromUserId?.lastName || ""}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="brand-gradient flex h-full w-full items-center justify-center text-6xl font-extrabold text-white">
                      {request.fromUserId?.firstName?.[0] || "?"}
                    </div>
                  )}

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-base-200 via-transparent to-transparent" />

                  {/* Request Badge */}
                  <span className="badge badge-primary badge-soft absolute right-4 top-4 backdrop-blur">
                    ● Request
                  </span>

                  {/* Name on Image */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h2 className="text-2xl font-extrabold">
                      {request.fromUserId?.firstName || "Unknown"}{" "}
                      {request.fromUserId?.lastName || ""}
                    </h2>

                    <p className="mt-1 text-sm capitalize text-base-content/70">
                      {[
                        request.fromUserId?.age && `${request.fromUserId.age} years old`,
                        request.fromUserId?.gender,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </figure>

                {/* Card Body */}
                <div className="card-body gap-4 p-5">
                  {/* About */}
                  <p className="line-clamp-3 text-sm leading-6 text-base-content/70">
                    {request.fromUserId?.about ||
                      "No information available about this user."}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {request.fromUserId?.skills?.length > 0 ? (
                      request.fromUserId.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="badge badge-primary badge-soft">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-base-content/50">
                        No skills added
                      </span>
                    )}

                    {request.fromUserId?.skills?.length > 5 && (
                      <span className="badge badge-ghost">
                        +{request.fromUserId.skills.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => reviewRequest("accepted", request._id)}
                      className="btn btn-primary flex-1"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => reviewRequest("rejected", request._id)}
                      className="btn btn-outline flex-1"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;