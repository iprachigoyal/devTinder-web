import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useSelector } from "react-redux";

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = useSelector((store) => store.user?.uid);

  const fetchConnections = async () => {
    if (!currentUserId) return;
  
    try {
      // Get all accepted connections involving the current user as the receiver
      const connectionsRef = collection(db, "connections");
      const q = query(
        connectionsRef,
        where("status", "==", "accepted"),
        where("receiverId", "==", currentUserId)
      );
  
      const querySnapshot = await getDocs(q);
      const connectionsData = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
  
          // Get sender user details (update from receiverId to senderId)
          const senderQuery = query(
            collection(db, "users"),
            where("uid", "==", data.senderId)  // Change this to fetch sender data
          );
          const senderSnapshot = await getDocs(senderQuery);
          const senderData = senderSnapshot.docs[0]?.data() || {};
  
          return {
            id: docSnap.id,
            ...senderData,  // Include sender data instead of receiver data
          };
        })
      );
  
      setConnections(connectionsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching connections:", error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchConnections();
  }, [currentUserId]);

  if (loading) {
    return <div className="text-center mt-8">Loading connections...</div>;
  }

  if (connections.length === 0) {
    return (
      <div className="text-center mt-8">
        No connections found. Start matching with developers!
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Connections</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((user) => (
          <div key={user.uid} className="card bg-base-300 shadow-xl">
            <figure className="px-4 pt-4">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt={user.displayName}
                className="rounded-xl h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{user.displayName}</h2>
              <div className="flex gap-2">
                {user.age && <span className="badge badge-neutral">{user.age}</span>}
                {user.gender && <span className="badge badge-primary">{user.gender}</span>}
              </div>
              <p className="mt-2 text-gray-600">{user.about || "No bio provided"}</p>
              {user.skills && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span key={index} className="badge badge-outline">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsPage;