import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail, // Import sendPasswordResetEmail
} from "firebase/auth"; // Fixed typo here
import "./login.css";
import { db, auth } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for password visibility

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
  const [loadings, setLoadings] = useState(false);
  const [email, setEmail] = useState(""); // State for email input in reset

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

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setLoadings(true);

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    const { email, password } = formValues;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        toast.error("Email or Password is incorrect.");
      } else {
        toast.error(err.message);
      }
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

    // Check if the user has uploaded an avatar
    if (!avatar.file) {
      toast.error("Please upload a profile picture before signing up.");
      setLoadings(false);
      return; // Prevent form submission
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account Created! You can login now!");
      toast.success("Referesh Page Onve! If You are New User After Login !");

      console.log("User created: ", res.user);
    } catch (err) {
      console.log(err);
      toast.error("Error creating account: " + err.message);
    } finally {
      setLoadings(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error("Error sending password reset email: " + error.message);
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
            <input
              type="email"
              placeholder="Email"
              name="email"
              autoComplete="off"
              required
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />

            <div className="password-field">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                name="password"
                autoComplete="off"
                required
              />
              {/* Eye icon to toggle password visibility */}
              <span
                onClick={togglePasswordVisibility}
                className="toggle-password"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="submit-button" disabled={loadings}>
              {loadings ? "loading" : "Sign In"}
            </button>

            {/* Forgot Password link */}
            <p onClick={handlePasswordReset} className="forgot-password">
              Forgot Password?
            </p>
          </form>
        )}

        {/* Sign Up Form */}
        {isSignUp && (
          <form onSubmit={handleSignUp}>
            <label htmlFor="file" className="avatar-upload">
              <img
                src={avatar.url || "./avatar1.png"}
                alt="Avatar Preview"
                className="avatar"
                required
              />
              Upload Image
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              autoComplete="off"
              required
            />
            <input
              type="email"
              placeholder="Email"
              autoComplete="off"
              name="email"
              required
            />

            <div className="password-field">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                name="password"
                autoComplete="off"
                required
              />
              {/* Eye icon to toggle password visibility */}
              <span
                onClick={togglePasswordVisibility}
                className="toggle-password"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="submit-button" disabled={loadings}>
              {loadings ? "loading" : "Sign Up"}
            </button>
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
