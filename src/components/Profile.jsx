import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const Profile = () => {
    const authUser = useSelector((store) => store.user); // Authenticated User
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authUser) {
      const fetchUserProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", authUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            console.log("User profile not found!");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    }
  }, [authUser]);

  if (!authUser || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading user profile...</p>
      </div>
    );
  }

    return ( <div>
        <EditProfile user={user}/>
    </div> );
}
 
export default Profile;