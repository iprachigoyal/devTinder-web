import { useState } from "react";
import UserCard from "./UserCard";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [age, setAge] = useState(user.age || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skillsInput, setSkillsInput] = useState(user.skills?.join(", ") || "");
  const [showToast, setShowToast] = useState(false);

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      
      // Convert skills input to array
      const skillsArray = skillsInput
        .split(",")
        .map(skill => skill.trim())
        .filter(skill => skill);

      const updatedData = { 
        displayName, 
        age: Number(age) || null,
        photoURL,
        gender,
        about,
        skills: skillsArray 
      };

      await updateDoc(userRef, updatedData);
      dispatch(addUser({ ...user, ...updatedData }));
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 my-4 mx-4">
        <div className="w-full md:w-96">
          <div className="card bg-base-300 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Profile Photo URL</span>
                  </label>
                  <input
                    type="url"
                    value={photoURL}
                    className="input input-bordered"
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Display Name</span>
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    className="input input-bordered"
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Age</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    className="input input-bordered"
                    onChange={(e) => setAge(e.target.value)}
                    min="18"
                    max="100"
                    placeholder="Enter your age"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">About Me</span>
                  </label>
                  <textarea
                    value={about}
                    className="textarea textarea-bordered h-32"
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Describe yourself..."
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Skills (comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    className="input input-bordered"
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="JavaScript, React, Node.js"
                  />
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button 
                  className="btn btn-primary w-full"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-96">
          <h3 className="text-xl font-semibold mb-4 text-center">Preview</h3>
          <UserCard 
            user={{ 
              displayName, 
              age, 
              gender, 
              about, 
              photoURL, 
              skills: skillsInput.split(",").map(s => s.trim()).filter(s => s)
            }} 
          />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile updated successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;