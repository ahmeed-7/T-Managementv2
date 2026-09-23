export default function Button({children, variant= "primary",className="" , ...props}){
    const base="px-5 py-2.5 rounded-full font-medium transition inline-flex items-center gap-2 justify-center"
    const styles={
        primary : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90",
        secondary : "border border-white/20 text-white hover:bg-white/5",

    }
    return(
        <button className={`${base} ${styles[variant]} ${className}`}{...props}>
            {children}
        </button>
    )
    
}