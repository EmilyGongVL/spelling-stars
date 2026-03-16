export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-3xl shadow-xl p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
