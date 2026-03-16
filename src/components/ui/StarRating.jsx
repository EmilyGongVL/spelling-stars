export function StarRating({ stars, max = 3, size = 'lg' }) {
  const sizes = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-6xl', xl: 'text-8xl' };
  return (
    <div className={`flex gap-2 justify-center ${sizes[size]}`} role="img" aria-label={`${stars} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );
}
