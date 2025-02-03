import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { addUser } from "../utils/userSlice";
import { DEF_URL } from "../utils/constant";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // Firebase Authentication signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set default profile photo if empty
      const defaultPhotoURL = DEF_URL;
      const finalPhotoURL = photoURL || defaultPhotoURL;

      // Save user profile to Firestore
      const userProfile = {
        displayName: name,
        photoURL: finalPhotoURL,
        age: null,
        gender: "",
        skills: [],
        about: "",
        uid: user.uid,
        email: user.email
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);

      // Dispatch user data to Redux store
      dispatch(addUser(userProfile));

      // Navigate to home page after successful signup
      navigate("/");

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Sign Up</h2>
          <div>
            <label className="form-control w-full max-w-xs my-2">
              <span className="label-text">Email ID</span>
              <input
                type="email"
                value={email}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="form-control w-full max-w-xs my-2">
              <span className="label-text">Password</span>
              <input
                type="password"
                value={password}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label className="form-control w-full max-w-xs my-2">
              <span className="label-text">Name</span>
              <input
                type="text"
                value={name}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="form-control w-full max-w-xs my-2">
              <span className="label-text">Photo URL</span>
              <input
                type="text"
                value={photoURL}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </label>

            <p className="text-red-500">{errorMessage}</p>

            <div className="card-actions justify-end m-2 pt-2">
              <button className="btn btn-primary" onClick={handleSignup}>Sign Up</button>
            </div>
            <p>Existig User? Login <Link to="/login">Here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
