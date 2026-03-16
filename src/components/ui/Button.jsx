export function Button({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', ...props }) {
  const base = 'font-bold rounded-2xl transition-all duration-150 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2';
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400 disabled:bg-indigo-300',
    secondary: 'bg-white hover:bg-gray-100 text-indigo-700 border-2 border-indigo-300 focus:ring-indigo-300',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400',
    ghost: 'bg-transparent hover:bg-white/20 text-white focus:ring-white/50',
    yellow: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 focus:ring-yellow-300',
  };
  const sizes = {
    sm: 'px-4 py-2 text-base min-h-[44px]',
    md: 'px-6 py-3 text-lg min-h-[52px]',
    lg: 'px-8 py-4 text-xl min-h-[60px]',
    xl: 'px-10 py-5 text-2xl min-h-[72px]',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
