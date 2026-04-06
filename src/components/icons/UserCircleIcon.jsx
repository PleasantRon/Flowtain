export function UserCircleIcon({ className = "h-6 w-6", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path strokeLinecap="round" d="M6.5 19c.8-2.3 2.7-4 5.5-4s4.7 1.7 5.5 4" />
    </svg>
  );
}
