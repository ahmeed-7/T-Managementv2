import { useState } from "react";
import Button from "../components/Button";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import {Link} from 'react-router-dom'
export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in.")
      }

      localStorage.setItem("token", data.token)
      setMessageType("success")
      setMessage("Signed in successfully.")
    } catch (error) {
      setMessageType("error")
      setMessage(error instanceof Error ? error.message : "Unable to sign in.")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    
    <AuthLayout title="Welcome Back" subtitle="Sign in to your T-Management account" footer={<>Don't have an account? <Link to="/register" className="text-purple-400 hover:underline">Create one</Link></>}>
    <form onSubmit={handleLogin}>
      <Input label="Email Address :" name="email" type="email" autoComplete="email" placeholder="Enter your email address" required/> 
      <Input label="Password :" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required/> 
      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">{isSubmitting ? "Signing in..." : "Login"}</Button>
      {message && <p role={messageType === "error" ? "alert" : "status"} className={`mt-4 text-sm ${messageType === "error" ? "text-red-400" : "text-green-400"}`}>{message}</p>}
    </form>
    </AuthLayout>

    
  )
}
