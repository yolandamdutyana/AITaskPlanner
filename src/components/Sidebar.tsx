import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  FileText,
  CheckSquare,
  Search,
  MessageSquare,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/email', icon: Mail, label: 'Email Generator' },
  { to: '/meeting', icon: FileText, label: 'Meeting Notes' },
  { to: '/tasks', icon: CheckSquare, label: 'Task Planner' },
  { to: '/research', icon: Search, label: 'Research Assistant' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chatbot' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-lavender-900 flex flex-col z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-lavender-700/50">
        <div className="w-8 h-8 rounded-lg bg-lavender-400 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">AI Workplace</p>
          <p className="text-lavender-200 text-xs">Productivity Assistant</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-lavender-300 text-xs font-medium uppercase tracking-wider px-3 mb-3">
          Features
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-lavender-500 text-white shadow-sm'
                      : 'text-lavender-200 hover:text-white hover:bg-lavender-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-lavender-300 group-hover:text-lavender-100'}`} />
                    <span className="flex-1">{label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-lavender-700/50">
        <div className="bg-lavender-800 rounded-lg px-3 py-3">
          <p className="text-lavender-200 text-xs leading-relaxed">
            AI-generated content may require human review before use.
          </p>
        </div>
      </div>
    </aside>
  );
}
