import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Settings, 
  PlusCircle 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { state, addDeck } = useAppContext();
  const location = useLocation();
  
  const handleAddDeck = () => {
    const newDeck = {
      id: crypto.randomUUID(),
      title: 'New Deck',
      description: 'Add a description for your deck',
      tags: ['new'],
      createdAt: new Date().toISOString(),
      cards: []
    };
    addDeck(newDeck);
  };

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/stats', icon: <BarChart3 size={20} />, label: 'Statistics' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-800 border-r border-slate-700 z-30 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="p-4 flex justify-end md:hidden">
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Decks section */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                My Decks
              </h2>
              <button 
                onClick={handleAddDeck}
                className="p-1 rounded-full hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              >
                <PlusCircle size={18} />
              </button>
            </div>
            
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {state.decks.map((deck) => (
                <Link
                  key={deck.id}
                  to={`/deck/${deck.id}`}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                    location.pathname === `/deck/${deck.id}`
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <BookOpen size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{deck.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;