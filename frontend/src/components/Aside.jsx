import { Link } from "react-router-dom";
export default function Aside({ className, userName }) {
  return (
    <div className={`flex h-screen w-72 flex h-screen w-72 flex-col border-r border-white/10 bg-black/40 p-4 text-gray-300 border-r border-white/10 bg-black/40 p-4 text-gray-300  ${className}`}>
      
      {/* First section: 20% */}
      <div className="flex gap-3    min-h-0  flex items-center">
        
        <span className="flex h-7 w-7 items-center justify-center bg-gradient-to-r from-blue-400 to-gray-400 rounded-full text-white font-semibold">
          {userName?.[0]?.toUpperCase()}
        </span>
        <div className="flex flex-col items-center justify-center mr-2">   
            <h1 className="text-md font-bold">{userName.substring(0, userName.indexOf('@')) || userName}</h1>
            <h3 className="text-sm text-green-500">Active</h3>
        </div>
        
      </div>
      <hr class="my-4 border-t border-gray-500 " />

      {/* Second section: 60% */}
      <div className="flex-[50] min-h-0 border-b border-2 border-gray-700 rounded-xl gap-4 flex flex-col mt-6">
        <Link to="/dashboard" className="flex ml-2  h-12 mt-3  hover:bg-gray-900 ">
          <span className="text-md text-cyan-400 font-semibold ">Dashboard</span>
        </Link>
        <Link to="/tasks" className="flex ml-2  h-12 mt-2  hover:bg-gray-900">
          <span className="text-md text-cyan-400 font-semibold">My tasks</span>
        </Link>
        <Link to="/calendar" className="flex ml-2  mt-2 h-12  hover:bg-gray-900">
          <span className="text-md text-cyan-400 font-semibold">Calender</span>
        </Link>
        <Link to="/notes" className="flex ml-2  mt-2 h-12  hover:bg-gray-900">
          <span className="text-md text-cyan-400 font-semibold">Notes</span>
        </Link>  
      </div>

      {/* Third section: 20% */}
      <div className="flex-[40] min-h-0 border-b flex flex-col mt-6 border-2 border-gray-700 rounded-xl">
        <div className="flex gap-10 mt-2">
          <h1 className="text-md flex  text-cyan-400 font-semibold ml-2">My projects</h1>
          <button className="flex  items-center justify-center h-8 w-12 rounded-full bg-gray-700 hover:bg-gray-900">
            Add
          </button>
        </div>
        <div className="flex flex-col mt-35 ml-10 ">
          <span></span>
          <h2 className="text-md text-cyan-400 font-semibold">Settings</h2>
        </div>
      </div>

    </div>
  );
}