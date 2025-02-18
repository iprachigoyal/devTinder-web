import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { doc, getDoc } from "firebase/firestore";

const Body = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();
  
  useEffect(()=>{
    const unsubscribe =onAuthStateChanged(auth, async(user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const {uid, email, displayName, photoURL} = user;
        const userRef=doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        let extraData = {};
        if (userSnap.exists()) {
          extraData = userSnap.data();
        } 

        // Merge Auth & Firestore data
        dispatch(addUser({ uid, email, displayName, photoURL, ...extraData }));
        // dispatch(addUser({uid:uid, email:email, displayName:displayName, photoURL:photoURL}));
        if (location.pathname === "/login") {
          navigate("/");
        }

        

        // ...
      } else {
        // User is signed out
        dispatch(removeUser());
        if (location.pathname !== "/signup") {
          navigate("/login");
        }
        // ...
      }
    });
    return () => unsubscribe();

  },[dispatch, navigate])

  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Body
