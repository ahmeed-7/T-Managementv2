import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import { useState } from "react";
import { apiRequest } from "../lib/api";
export default function RegisterPage() {
  const [name, setName] = useState('')
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try{
      if(password !== confirmPassword){
        throw new Error("Passwords do not match")
      }
    await apiRequest('/auth/register',{method:"POST",body:JSON.stringify({name,email,password})})
    navigate('/dashboard')
    }catch(err){
      setError(err.message)
    }finally{
      setLoading(false)
    }
  }
  return (
    <AuthLayout className="max-w-[400px]" title="Create Account" subtitle="Join T-Management and boost your productivity" footer={<>Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Sign in</Link></>}>
      <form onSubmit={handleRegister}>
      <Input label="Full Name" type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your full name"/> 
      <Input label="Email Address" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email address"/>
      <Input label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password"/>
      <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Confirm your password"/>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? 'Creating Account...' : 'Register'}</Button>  
      </form>
    </AuthLayout>    
  )
}
