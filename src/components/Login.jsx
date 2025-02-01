import { useState } from "react";
import{signInWithEmailAndPassword} from "firebase/auth"
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [emailid, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage]=useState(null);
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const handleLogin=()=>{
        signInWithEmailAndPassword(auth, emailid, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user);
    dispatch(
        addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        })
    );
    navigate("/");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setErrorMessage(errorMessage + " " + errorCode);
  });

    }
  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <div>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input
                type="text"
                value={emailid}
                className="input input-bordered w-full max-w-xs"
                onChange={(e)=>setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                value={password}
                className="input input-bordered w-full max-w-xs"
                onChange={(e)=>setPassword(e.target.value)}
              />
            </label>
          </div>
          <p className="label-text">{errorMessage}</p>
          <div className="card-actions justify-end m-2">
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
