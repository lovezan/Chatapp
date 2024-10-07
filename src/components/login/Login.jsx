import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth"; // Fixed typo here
import "./login.css";
import { db,auth } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loadings, setLoadings] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setLoadings(true);
  
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    const { email, password } = formValues;
  
    // Debugging: Log email and password
    console.log("Email:", email);
    console.log("Password:", password);
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoadings(false);
    }
  };
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoadings(true);
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    const { username, email, password } = formValues;

    try {
      
      
      const res = await createUserWithEmailAndPassword(auth, email, password); // Fixed typo here
      const imgUrl = await upload(avatar.file)
      
      await setDoc(doc(db, "users", res.user.uid), {
       username,
       email,
       avatar:imgUrl,
       id:res.user.uid,
       blocked:[],
      });

       
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats:[],
       });
 
       
      toast.success("Account Created! You can login now!");

      console.log("User created: ", res.user);

      toast.success("Account created successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }finally{
      setLoadings(false)
    }
  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="form-card">
        <h2 className="form-title">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>

        {/* Sign In Form */}
        {!isSignUp && (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" name="email" required />
            <input type="password" placeholder="Password" name="password" required />
            <button type="submit" className="submit-button" disabled={loadings}>{loadings ? "loading" : "Sign In"}</button>
          </form>
        )}

        {/* Sign Up Form */}
        {isSignUp && (
          <form onSubmit={handleSignUp}>
            <label htmlFor="file" className="avatar-upload">
              <img
                src={avatar.url || "./avatar.png"}
                alt="Avatar Preview"
                className="avatar"
              />
              Upload Image
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input type="text" placeholder="Username" name="username" required />
            <input type="email" placeholder="Email" name="email" required />
            <input type="password" placeholder="Password" name="password" required />
            <button type="submit" className="submit-button" disabled={loadings}>{loadings ? "loading" : "Sign Up"}</button>
          </form>
        )}

        <p className="toggle-form">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span onClick={toggleForm} className="link">
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
