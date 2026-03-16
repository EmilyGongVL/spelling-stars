const GRADES = [
  { key: 'year1', label: 'Year 1', color: 'bg-pink-400 hover:bg-pink-500', age: '5–6' },
  { key: 'year2', label: 'Year 2', color: 'bg-orange-400 hover:bg-orange-500', age: '6–7' },
  { key: 'year3', label: 'Year 3', color: 'bg-yellow-400 hover:bg-yellow-500', age: '7–8' },
  { key: 'year4', label: 'Year 4', color: 'bg-green-400 hover:bg-green-500', age: '8–9' },
  { key: 'year5', label: 'Year 5', color: 'bg-blue-400 hover:bg-blue-500', age: '9–10' },
  { key: 'year6', label: 'Year 6', color: 'bg-purple-400 hover:bg-purple-500', age: '10–11' },
];

export function GradeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {GRADES.map(g => (
        <button
          key={g.key}
          onClick={() => onSelect(g.key)}
          className={`${g.color} text-white rounded-2xl py-4 px-3 font-black text-lg transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-400 min-h-[80px] ${selected === g.key ? 'ring-4 ring-white ring-offset-2 scale-105' : ''}`}
          aria-pressed={selected === g.key}
        >
          <div className="text-xl">{g.label}</div>
          <div className="text-sm font-bold opacity-80">Age {g.age}</div>
        </button>
      ))}
    </div>
  );
}
