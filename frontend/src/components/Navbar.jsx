import {Link, Links} from 'react-router-dom'
import Button from "./Button"

export default function Navbar(){
    return (
        <nav className="flex items-center px-8 py-5">
            <Link to="/" className="flex ml-25  w-full items-center gp-2">
                <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500  flex items-center justify-center font-bold'>T</div>
                <span className='font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text ml-2 text-transparent'>T-Management</span>
            </Link>
            <div className='flex items-center gap-4 justify-end w-full mr-25'>
                <Link to="/login" className="text-gray-300  hover:text-white">Log In</Link>
                <Link to='/register'>
                    <Button>Get Started</Button>
                </Link>
            </div>
        </nav>
    )
}