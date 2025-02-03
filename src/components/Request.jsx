import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";

const ConnectionRequests = () => {

        const dispatch = useDispatch();
        const request = useSelector((store) => store.request);
        const [requests, setRequests] = useState([]);
        const currentUserId = useSelector((store) => store.user?.uid);
      
        const fetchRequests = async () => {
            if (!currentUserId) return;

            try {
              const q = query(
                collection(db, "connections"),
                where("receiverId", "==", currentUserId),
                where("status", "==", "pending")
              );
        
              const querySnapshot = await getDocs(q);
              const requestsData = await Promise.all(
                querySnapshot.docs.map(async (docSnap) => {
                  const data = docSnap.data();
        
                  // Fetch sender details from 'users' collection
                  const senderQuery = query(
                    collection(db, "users"),
                    where("uid", "==", data.senderId)
                  );
                  const senderSnapshot = await getDocs(senderQuery);
                  const senderData = senderSnapshot.docs[0]?.data() || {};
        
                  return {
                    id: docSnap.id,
                    ...data,
                    senderName: senderData.displayName || "Unknown",
                    senderPhoto: senderData.photoURL || "https://via.placeholder.com/150",
                    timestamp: data.timestamp?.toDate().toISOString(), // Convert Firestore Timestamp
                  };
                })
              );
        
              setRequests(requestsData);
              dispatch(addRequests(requestsData));
            } catch (error) {
              console.error("Error fetching requests:", error);
            }
        };
      
        useEffect(() => {
          fetchRequests();
        }, [currentUserId]);
      
        if (!request) return null;



        const handleAccept = async (requestId, senderId) => {
            try {
              // Query the 'connections' collection to find the document
              const requestRefQuery = query(
                collection(db, "connections"),
                where("receiverId", "==", currentUserId),
                where("senderId", "==", senderId),  // Assuming senderId is also available
                where("status", "==", "pending")
              );
          
              const querySnapshot = await getDocs(requestRefQuery);
          
              // If the document exists
              if (querySnapshot.empty) {
                console.error("No matching document found for the request.");
                return;
              }
          
              // Get the first matching document
              const requestDoc = querySnapshot.docs[0];
              const requestRef = doc(db, "connections", requestDoc.id); // Use the correct document ID
          
              // Update connection status to "accepted"
              await updateDoc(requestRef, { status: "accepted" });
          
              // Add to connectedUsers for both parties
              const currentUserRef = doc(db, "users", currentUserId);
              const senderUserRef = doc(db, "users", senderId);
          
              await Promise.all([
                updateDoc(currentUserRef, { connectedUsers: arrayUnion(senderId) }),
                updateDoc(senderUserRef, { connectedUsers: arrayUnion(currentUserId) })
              ]);
          
              // Remove the request from UI
              setRequests((prev) => prev.filter((req) => req.id !== requestId));
            } catch (error) {
              console.error("Error accepting request:", error);
            }
          };
          
          const handleIgnore = async (requestId) => {
            try {
              // Query the 'connections' collection to find the document
              const requestRefQuery = query(
                collection(db, "connections"),
                where("receiverId", "==", currentUserId),
                where("status", "==", "pending")
              );
          
              const querySnapshot = await getDocs(requestRefQuery);
          
              if (querySnapshot.empty) {
                console.error("No matching document found for the request.");
                return;
              }
          
              const requestDoc = querySnapshot.docs[0];
              const requestRef = doc(db, "connections", requestDoc.id); // Use the correct document ID
          
              // Update connection status to "ignored"
              await updateDoc(requestRef, { status: "ignored" });
          
              // Remove the request from UI
              setRequests((prev) => prev.filter((req) => req.id !== requestId));
            } catch (error) {
              console.error("Error ignoring request:", error);
            }
          };
          

  return (
    <div className="p-4">
  <h2 className="text-xl font-bold mb-4">Connection Requests</h2>
  {requests.length === 0 ? (
    <p>No pending requests</p>
  ) : (
    requests.map((request) => (
      <div key={request.id} className="flex bg-base-300 shadow-md mb-4 w-2/3 mx-auto">
        <div className="card-body p-4 flex items-center justify-between gap-4">
          {/* Left Section - Profile and Name */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div>

            <img
              src={request.senderPhoto}
              alt="user profile"
              className="w-20 h-20 rounded-full flex-shrink-0"
            />
            </div>
            <div>

            <p className="text-lg font-bold text-left">{request.senderName}</p>
            </div>
          </div>

          {/* Right Section - Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleIgnore(request.id)}
              className="btn btn-error btn-sm"
            >
              Ignore
            </button>
            <button
              onClick={() => handleAccept(request.id, request.senderId)}
              className="btn btn-success btn-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    ))
  )}
</div>
  
  );
};

export default ConnectionRequests;