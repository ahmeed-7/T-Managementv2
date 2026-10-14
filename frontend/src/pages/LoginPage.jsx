import { useState } from "react";
import Button from "../components/Button";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import {Link, useNavigate} from 'react-router-dom';
import {apiRequest} from "../lib/api"
export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,setError]=useState("");
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate=useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try{
      const data= await apiRequest("/auth/login",{
        method:"POST",
        body:JSON.stringify({email,password})
      });

      localStorage.setItem("token",data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      navigate("/dashboard")
    }catch(err){
      setError(err.message)
    }finally{
      setIsSubmitting(false)
    }
  }
  return (
    
    <AuthLayout title="Welcome back" subtitle="Sign in to your T-Management account." footer={<>Don’t have an account? <Link to="/register" className="font-semibold text-[#7161d7] hover:underline">Create one</Link></>}>
    <form onSubmit={handleLogin}>
      <Input label="Email address" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" autoComplete="email" placeholder="Enter your email address" required/>
      <Input label="Password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="Enter your password" required/>
      {error && <p role="alert" className="mb-3 rounded-xl border border-[#f7d0d2] bg-[#fff2f1] px-4 py-3 text-sm text-[#b44850]">{error}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-1 min-h-12 w-full text-base">{isSubmitting ? "Signing in…" : "Sign in"}</Button>
    </form>
    </AuthLayout>

    
  )
}
