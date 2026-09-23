import Button from "../components/Button";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import {Link,useNavigate} from 'react-router-dom'
import { useState } from 'react'
import { apiRequest } from '../lib/api'
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try{
      const data= await apiRequest("/auth/login",{
        method:"POST",
        body:JSON.stringify({email,password})
      });
      localStorage.setItem("token",data.token)
      navigate("/dashboard")
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }

  }
  return (
    
    <AuthLayout title="Welcome Back" subtitle="Sign in to your T-Management account" footer={<>Don't have an account? <Link to="/register" className="text-purple-400 hover:underline">Create one</Link></>}>
    <form onSubmit={handleLogin}>
      <Input label="Email Address :" type="email" placeholder="Enter your email address"value={email} onChange={(e)=>setEmail(e.target.value)} /> 
      <Input label="Password :" type="password" placeholder="Enter your password" value={password} onChange={(e)=>setPassword(e.target.value)} /> 
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? 'Logging in...': 'Login'}</Button>
    </form>
    </AuthLayout>

    
  )
}
