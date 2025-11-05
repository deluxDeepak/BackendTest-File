import React, { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebaseConfig";

function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const sendOtp = async () => {
    if (!phone) {
      alert("Please enter a phone number");
      return;
    }

    setLoading(true);
    try {
      // Clear any existing recaptcha verifier
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
         // auth should be first parameter in v9+
        "recaptcha-container",
        { 
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved",response);
          },
          'expired-callback': () => {
            console.log("reCAPTCHA expired");
          }
        },
        auth,

      );

      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      console.log("OTP sent successfully:", result);
      
      setConfirmationResult(result);
      alert("OTP Sent to " + phone);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP: " + error.message);
      
      // Clear recaptcha on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    }
    setLoading(false);
  };

  // Step 2: Verify OTP & Send token to backend
  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    if (!confirmationResult) {
      alert("Please send OTP first");
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      console.log("User authenticated:", result.user);

      // Send token to backend
      const response = await fetch("http://localhost:3000/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data.success) {
        alert("Login Success! JWT: " + data.token);
        // Reset form
        setPhone("");
        setOtp("");
        setConfirmationResult(null);
      } else {
        alert("Backend verification failed");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  // Reset function
  const resetAuth = () => {
    setPhone("");
    setOtp("");
    setConfirmationResult(null);
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Phone Authentication</h2>
      
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="+91xxxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading || confirmationResult}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <div id="recaptcha-container"></div>
        <button 
          onClick={sendOtp}
          disabled={loading || confirmationResult}
          style={{ width: "100%", padding: "10px" }}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>

      {confirmationResult && (
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button 
            onClick={verifyOtp}
            disabled={loading}
            style={{ width: "100%", padding: "10px", marginRight: "10px" }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      <button 
        onClick={resetAuth}
        style={{ width: "100%", padding: "10px", backgroundColor: "#f44336", color: "white" }}
      >
        Reset
      </button>

      {confirmationResult && (
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          OTP sent to {phone}. Check your messages.
        </p>
      )}
    </div>
  );
}

export default PhoneAuth;