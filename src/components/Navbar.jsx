import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";



const Navbar = () => {
  const user = useSelector((store) => store.user);
  const handleLogout=()=>{
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
    
  }
  
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">🖥️ DevTinder</Link>
      </div>
      {user && <div className="flex-none gap-2">
        <div className="form-control">Hi! {user.displayName}</div>
        <div className="dropdown dropdown-end mx-6">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="user photo"
                src={user.photoURL}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link to="/connections">Connections</Link>
            </li>
            <li>
              <Link to="/requests">Connection Request</Link>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>}
    </div>
  );
};

export default Navbar;
