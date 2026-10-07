import { BASE_URL } from "../utils/constants";

import { useEffect, useState } from "react";

import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import { addConnections } from "../utils/connectionSlice";

import { useNavigate } from "react-router-dom";

import VerifiedBadge from "./VerifiedBadge";

const Connections = () => {
  const connections = useSelector((store) => store.connection);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // Loading skeleton dikhane ke liye
  const [loading, setLoading] = useState(true);

  // Fetch Connections
  const fetchConnections = async () => {
    if (connections.length > 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      // Store connections in Redux
      dispatch(addConnections(res.data.connections));
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch connections when component loads
  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="flex-1 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            My Connections{" "}
            {connections.length > 0 && (
              <span className="badge badge-primary badge-soft align-middle">
                {connections.length}
              </span>
            )}
          </h1>
          <p className="mt-2 text-sm text-base-content/60">
            People you're connected with on DevConnect
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton h-96 w-full" />
            ))}
          </div>
        ) : connections.length === 0 ? (
          /* Empty state */
          <div className="card mx-auto max-w-md border border-base-300 bg-base-200 shadow-xl">
            <div className="card-body items-center py-12 text-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl">
                👥
              </div>
              <h2 className="text-lg font-semibold">No connections yet</h2>
              <p className="text-sm text-base-content/60">
                Start connecting with developers to see them here.
              </p>
            </div>
          </div>
        ) : (
          /* Connections List */
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((connection) => (
              <div
                key={connection._id}
                className="group card overflow-hidden border border-base-300 bg-base-200 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                {/* Profile Image */}
                <figure className="relative h-64">
                  {connection.photoUrl ? (
                    <img
                      src={connection.photoUrl}
                      alt={`${connection.firstName || "User"} ${connection.lastName || ""}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="brand-gradient flex h-full w-full items-center justify-center text-6xl font-extrabold text-white">
                      {connection.firstName?.[0] || "?"}
                    </div>
                  )}

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-base-200 via-transparent to-transparent" />

                  {/* Connected Badge */}
                  <span className="badge badge-success badge-soft absolute right-4 top-4 backdrop-blur">
                    ● Connected
                  </span>

                  {/* Name on Image */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h2 className="flex items-center gap-1.5 text-2xl font-extrabold">
                      {connection.firstName || "Unknown"}{" "}
                      {connection.lastName || ""}
                      {connection.isPremium && <VerifiedBadge />}
                    </h2>

                    <p className="mt-1 text-sm capitalize text-base-content/70">
                      {[connection.age && `${connection.age} years old`, connection.gender]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </figure>

                {/* Card Body */}
                <div className="card-body gap-4 p-5">
                  {/* About */}
                  <p className="line-clamp-3 text-sm leading-6 text-base-content/70">
                    {connection.about ||
                      "No information available about this user."}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {connection.skills?.length > 0 ? (
                      connection.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="badge badge-primary badge-soft">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-base-content/50">
                        No skills added
                      </span>
                    )}

                    {connection.skills?.length > 5 && (
                      <span className="badge badge-ghost">
                        +{connection.skills.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Message Button: chat page kholta hai */}
                  <button
                    onClick={() => navigate(`/chat/${connection._id}`)}
                    className="btn btn-primary btn-block mt-auto"
                  >
                    💬 Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;