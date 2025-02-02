import { useState } from "react";
import UserCard from "./UserCard";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({user}) => {
    const dispatch=useDispatch();
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [age, setAge] = useState(user.age || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
const handleSave=async()=>{
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const updatedData = { displayName, age, photoURL, gender, about };

      await updateDoc(userRef, updatedData);
    //   setUserData((prev) => ({ ...prev, ...updatedData }));
    dispatch(addUser(updatedData));
        setShowToast(true)
    //   alert("Profile updated successfully!");
    const i= setTimeout(() => {
        setShowToast(false)
    },3000)
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");

    }
    setLoading(false);
  };

  return (
    <>
    <div className="flex justify-center my-2 mx-10">
    <div className="flex justify-center my-2 mx-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Edit Profile</h2>
          <div>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Photo</span>
              </div>
              <input
                type="text"
                value={photoURL}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                type="text"
                value={displayName}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Age</span>
              </div>
              <input
                type="text"
                value={age}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Gender</span>
              </div>
              <select
                className="select select-bordered w-full max-w-xs"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">About</span>
              </div>
              <input
                type="text"
                value={about}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>
          </div>
          <div className="card-actions justify-end m-2">
            <button className="btn btn-primary" onClick={handleSave}>Save Profile</button>
          </div>
        </div>
      </div>
    </div>
    <UserCard user={{displayName, age, gender, about, photoURL}}/>
    
    </div>
    {showToast && (<div className="toast toast-top toast-center">
  <div className="alert alert-success">
    <span>Profile updated successfully!</span>
  </div>
</div>)}
    </>
  );
};

export default EditProfile;
