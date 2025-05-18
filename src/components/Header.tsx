import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, BrainCog, Search, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="mr-3 p-2 rounded-full hover:bg-slate-700 transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        
        <Link to="/" className="flex items-center">
          <BrainCog className="h-6 w-6 text-indigo-400 mr-2" />
          <span className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            NeuroDeck
          </span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2">
        {searchVisible ? (
          <div className="relative">
            <input
              type="text"
              placeholder="Search decks..."
              className="bg-slate-700 text-white rounded-full pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-48 md:w-64"
              autoFocus
              onBlur={() => setSearchVisible(false)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        ) : (
          <button 
            onClick={() => setSearchVisible(true)}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        )}
        
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-700 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Header;