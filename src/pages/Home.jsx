import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useProgress } from '../hooks/useProgress';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { getParentPin } from '../utils/storage';

const AVATARS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐙', '🦋', '🦄', '🦖', '🦕', '🐲'];
const GRADES = ['year1','year2','year3','year4','year5','year6'];

export default function Home() {
  const navigate = useNavigate();
  const { selectStudent, enterParentMode } = useUser();
  const { students, createStudent } = useProgress();
  const [showCreate, setShowCreate] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('year1');
  const [newAvatar, setNewAvatar] = useState('🐶');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleCreateStudent = () => {
    if (!newName.trim()) return;
    const student = createStudent(newName.trim(), newGrade, newAvatar);
    selectStudent(student);
    navigate('/dashboard');
  };

  const handleSelectStudent = (student) => {
    selectStudent(student);
    navigate('/dashboard');
  };

  const handleParentPin = () => {
    if (pin === getParentPin()) {
      enterParentMode();
      navigate('/parent');
    } else {
      setPinError('Incorrect PIN. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">✏️</div>
          <h1 className="text-5xl font-black text-white drop-shadow-lg mb-2">SpellingStars</h1>
          <p className="text-xl text-white/80 font-bold">Learn to spell — one star at a time!</p>
        </div>

        {students.length > 0 && (
          <Card className="mb-4">
            <h2 className="text-xl font-black text-gray-700 mb-3">Who are you?</h2>
            <div className="grid grid-cols-2 gap-3">
              {students.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectStudent(s)}
                  className="flex flex-col items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 rounded-2xl p-4 transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-400 min-h-[100px]"
                >
                  <span className="text-4xl">{s.avatar}</span>
                  <span className="font-black text-lg text-gray-800">{s.name}</span>
                  <span className="text-sm text-gray-500">{s.grade?.replace('year', 'Year ')}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-3 w-full border-2 border-dashed border-indigo-300 rounded-2xl py-3 text-indigo-600 font-bold text-lg hover:bg-indigo-50 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-400 min-h-[52px]"
            >
              + Add new student
            </button>
          </Card>
        )}

        {students.length === 0 && (
          <div className="flex flex-col gap-4 mb-4">
            <Button size="xl" onClick={() => setShowCreate(true)} className="w-full">
              🎓 I'm a Student
            </Button>
          </div>
        )}

        <button
          onClick={() => setShowPin(true)}
          className="w-full text-white/70 hover:text-white text-base font-bold py-3 focus:outline-none focus:ring-4 focus:ring-white/50 rounded-xl transition-all"
        >
          👨‍👩‍👧 Parent / Teacher View
        </button>
      </div>

      {/* Create Student Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Your Profile">
        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Your name</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateStudent()}
              placeholder="Enter your name"
              className="w-full border-2 border-indigo-300 rounded-xl px-4 py-3 text-xl font-bold focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-1">Year group</label>
            <select
              value={newGrade}
              onChange={e => setNewGrade(e.target.value)}
              className="w-full border-2 border-indigo-300 rounded-xl px-4 py-3 text-xl font-bold focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200"
            >
              {GRADES.map(g => (
                <option key={g} value={g}>{g.replace('year', 'Year ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">Pick your avatar</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map(a => (
                <button
                  key={a}
                  onClick={() => setNewAvatar(a)}
                  className={`text-3xl p-2 rounded-xl transition-all ${newAvatar === a ? 'bg-indigo-200 ring-2 ring-indigo-500' : 'hover:bg-gray-100'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <Button size="lg" onClick={handleCreateStudent} disabled={!newName.trim()} className="w-full">
            Let's go! {newAvatar}
          </Button>
        </div>
      </Modal>

      {/* Parent PIN Modal */}
      <Modal open={showPin} onClose={() => { setShowPin(false); setPin(''); setPinError(''); }} title="Parent / Teacher Access">
        <p className="text-gray-600 mb-4">Enter PIN to view progress reports. (Default: 1234)</p>
        <input
          type="password"
          value={pin}
          onChange={e => { setPin(e.target.value); setPinError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleParentPin()}
          placeholder="Enter PIN"
          className="w-full border-2 border-indigo-300 rounded-xl px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 mb-3"
          autoFocus
          maxLength={6}
        />
        {pinError && <p className="text-red-600 font-bold mb-3" role="alert">{pinError}</p>}
        <Button size="lg" onClick={handleParentPin} className="w-full">Enter</Button>
      </Modal>
    </div>
  );
}
