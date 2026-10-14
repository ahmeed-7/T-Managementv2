export default function Input({ label, ...props }) {
  return (
    <div className="mb-5">
      {label && <label htmlFor={props.id || props.name} className="mb-2 block text-sm font-semibold text-[#565368] sm:text-base">{label}</label>}
      <input
        className="min-h-12 w-full rounded-xl border border-[#e8e6ef] bg-white px-4 py-3 text-base text-[#373449] outline-none transition placeholder:text-[#aaa8b6] hover:border-[#d6d2e8] focus:border-[#a69bec] focus:ring-4 focus:ring-[#796be814]"
        {...props}
        id={props.id || props.name}
      />
    </div>
  )
}