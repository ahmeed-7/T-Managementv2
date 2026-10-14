export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#796be8] disabled:cursor-not-allowed disabled:opacity-60'
  const styles = {
    primary: 'bg-[#796be8] text-white shadow-[0_5px_13px_rgba(121,107,232,0.18)] hover:-translate-y-0.5 hover:bg-[#6b5cda]',
    secondary: 'border border-[#e9e8ef] bg-white text-[#666478] hover:-translate-y-0.5 hover:border-[#d9d4fa] hover:bg-[#f8f7fc]',
  }

  return <button className={`${base} ${styles[variant] || styles.primary} ${className}`} {...props}>{children}</button>
}