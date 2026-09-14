import Button from "../components/Button";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
export default function RegisterPage() {
  return (
    <AuthLayout title="Create Account" subtitle="Join T-Management and boost your productivity" footer={<>Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Sign in</Link></>}>
      <Input label="Full Name" type="text" placeholder="Enter your full name"/> 
      <Input label="Email Address" type="email" placeholder="Enter your email address"/>
      <Input label="Password" type="password" placeholder="Enter your password"/>
      <Input label="Confirm Password" type="password" placeholder="Confirm your password"/>
      <Button className="w-full mt-4">Register</Button>  
    </AuthLayout>    
  )
}
