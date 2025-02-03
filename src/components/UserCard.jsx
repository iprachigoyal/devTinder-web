import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({user}) => {
  const dispatch=useDispatch();
    const{name, skills, photoURL, age, gender, about, email, uid} = user;
    console.log(user);
    const senderId= useSelector(store=>store.user?.uid);
    const receiverId = uid;
    console.log(senderId, receiverId);
    const sendConnectionRequest = async () => {
      if (!senderId) {
        console.error("User not logged in or Redux state not initialized");
        return;
      }
  
      try {
        await addDoc(collection(db, "connections"), {
          senderId,
          receiverId,
          status: "pending",
          timestamp: new Date(),
        });
  
        const userRef = doc(db, "users", senderId);
        await updateDoc(userRef, {
          connectedUsers: arrayUnion(receiverId),
        });
  
        dispatch(removeUserFromFeed(receiverId));
        console.log("Request sent!");
      } catch (error) {
        console.error("Error sending request: ", error);
      }
    };
    
    const ignoreUser = async () => {
      if (!senderId) {
        console.error("User not logged in or Redux state not initialized");
        return;
      }
    
      try {
        // Add the ignored user to the current user's document in Firestore
        const userRef = doc(db, "users", senderId);
        await updateDoc(userRef, {
          ignoredUsers: arrayUnion(receiverId),
        });
    
        // Remove the user from the Redux feed
        dispatch(removeUserFromFeed(receiverId));
        console.log("User ignored:", receiverId);
      } catch (error) {
        console.error("Error ignoring user: ", error);
      }
    };
  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img
          src={photoURL}
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        {age && gender&& <p>{age+ ", "+gender}</p>}
        <p>{about}</p>
        <div className="card-actions justify-center my-2">
          <button className="btn btn-primary" onClick={ignoreUser}>Ignore</button>
          <button className="btn btn-secondary" onClick={sendConnectionRequest}>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
