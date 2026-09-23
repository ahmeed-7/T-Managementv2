import {Link} from 'react-router-dom'

export default function AuthLayout({children,title,subtitle,footer}){
    return (
        <div className='items-center min-h-screen bg-black flex flex-col justify-center px-4 relative'>
            <Link to='/'className='mt-2 mb-4 text-gray-400 hover:text-white text-sm'>
                ← Back to home
            </Link>
            <div className="w-full max-w-sm bg-zinc-900/60 border border-white/10 rounded-2xl p-8 mb-2">
                <div className="flex flex-col items-center mb-6">
                    <div className='w-10 h-10 rounded-lg bg-gradient-to-br text-white from-purple-500 to-pink-500  flex items-center justify-center font-bold text-xl mb-2'>T</div>
                    <h1 className="text-xl font-bold text-white">{title}</h1>
                    <p className="text-sm text-gray-400 mt-1 text-center">{subtitle}</p>
                </div>
                {children}
                  {footer && <p className="text-sm text-gray-400 text-center mt-6">{footer}</p>}
            </div>
        </div>
    )
}