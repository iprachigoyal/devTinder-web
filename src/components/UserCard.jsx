import { addDoc, collection } from "firebase/firestore";
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
        await addDoc(collection(db, "connection"), {
          senderId,
          receiverId,
          status: "pending",
          timestamp: new Date(),
        });
        console.log("Request sent!");
        dispatch(removeUserFromFeed(receiverId))
      } catch (error) {
        console.error("Error sending request: ", error);
      }
    };
    const ignoreUser = () => {
      dispatch(removeUserFromFeed(receiverId)); // Simply remove from feed
      console.log("User ignored:", receiverId);
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
