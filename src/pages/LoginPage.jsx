import Button from "../components/Button";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import {Link} from 'react-router-dom'
export default function LoginPage() {
  return (
    
    <AuthLayout title="Welcome Back" subtitle="Sign in to your T-Management account" footer={<>Don't have an account? <Link to="/register" className="text-purple-400 hover:underline">Create one</Link></>}>
    <Input label="Email Address :" type="email" placeholder="Enter your email address"/> 
    <Input label="Password :" type="password" placeholder="Enter your password"/> 
    <Button className="w-full mt-4">Login</Button>
    </AuthLayout>
    
  )
}
