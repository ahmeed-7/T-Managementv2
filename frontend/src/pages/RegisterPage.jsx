import Button from "../components/Button";
import { Link ,useNavigate} from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import {apiRequest} from "../lib/api";
import { useState } from "react";


export default function RegisterPage() {
  const [error,setError]=useState("");
  const [loading,setLoading] = useState(false);
  const [full_name,setFull_name]=useState("");
  const [confirmed_pass,setConfirmed_pass]=useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const  handleRegister = async(e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try{
    await apiRequest("/auth/register",{
        method:"POST",
        body:JSON.stringify({email,password,confirmed_pass,full_name})
      });

    navigate("/login")
    }catch(error){
      setError(error.message)
    }finally{
      setLoading(false)
    }
  }
  return (
    <AuthLayout showPromoMobile promoClassName="mrregister" title="Create your account" subtitle="Join T-Management and give your ideas a little more room." footer={<>Already have an account? <Link to="/login" className="font-semibold text-[#7161d7] hover:underline">Sign in</Link></>}>
      <form onSubmit={handleRegister}>
      <Input label="Full name" name="full_name" autoComplete="name" type="text" value={full_name} onChange={(e)=>setFull_name(e.target.value)} placeholder="Enter your full name" required/>
      <Input label="Email address" name="email" autoComplete="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email address" required/>
      <Input label="Password" name="password" autoComplete="new-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Create a password" required/>
      <Input label="Confirm password" name="confirmed_pass" autoComplete="new-password" value={confirmed_pass} onChange={(e)=>setConfirmed_pass(e.target.value)} type="password" placeholder="Enter your password again" required/>
      {error && <p role="alert" className="mb-3 rounded-xl border border-[#f7d0d2] bg-[#fff2f1] px-4 py-3 text-sm text-[#b44850]">{error}</p>}
      <Button type="submit" className="mt-1 min-h-12 w-full text-base" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>
      </form>
    </AuthLayout>    
  )
}
