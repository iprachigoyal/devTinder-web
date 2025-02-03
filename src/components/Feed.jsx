import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const currentUserId = useSelector((store) => store.user?.uid);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!currentUserId) return;

      try {
        // 1. Get the current user's ignored/connected list from Firestore
        const currentUserRef = doc(db, "users", currentUserId);
        const currentUserSnap = await getDoc(currentUserRef);
        const { ignoredUsers = [], connectedUsers = [] } = currentUserSnap.data() || {};

        // 2. Query users NOT in ignored/connected lists and exclude current user
        const excludedUsers = [...ignoredUsers, ...connectedUsers, currentUserId];
        const usersQuery = query(
          collection(db, "users"),
          where("__name__", "not-in", excludedUsers)
        );

        const querySnapshot = await getDocs(usersQuery);
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 3. Update Redux store with filtered users
        dispatch(addFeed(userList));
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchFeed();
  }, [currentUserId, dispatch]);

  if (!feed) return null;
  if (feed.length === 0) {
    return <h1 className="flex justify-center my-10">No new users found</h1>;
  }

  return (
    <div className="flex justify-center my-8">
      {/* Display the first user in the feed (Tinder-style) */}
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;