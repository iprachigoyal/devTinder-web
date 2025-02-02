import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  //   const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const getFeed = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //   setUsers(userList);
      dispatch(addFeed(userList));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    feed && (<div className="flex justify-center my-8">
      <UserCard user={feed[0]}/>
    </div>)
  );
};

export default Feed;
