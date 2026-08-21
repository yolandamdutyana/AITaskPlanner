import { Mail, FileText, CheckSquare, Search, MessageSquare, ArrowRight, Sparkles, TrendingUp, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui';

const features = [
  {
    to: '/email',
    icon: Mail,
    title: 'Email Generator',
    description: 'Craft professional emails tailored to tone and audience in seconds.',
    color: 'text-lavender-600',
    bg: 'bg-lavender-50',
    border: 'border-lavender-100',
  },
  {
    to: '/meeting',
    icon: FileText,
    title: 'Meeting Notes Summarizer',
    description: 'Extract key points, action items, and deadlines from raw notes.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    to: '/tasks',
    icon: CheckSquare,
    title: 'AI Task Planner',
    description: 'Prioritize your workload and build an optimized daily schedule.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    to: '/research',
    icon: Search,
    title: 'Research Assistant',
    description: 'Get concise insights, summaries, and key findings on any topic.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    to: '/chat',
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: 'Ask anything — your always-on AI assistant for work questions.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
];

const stats = [
  { label: 'AI Features', value: '5', icon: Sparkles, color: 'text-lavender-600', bg: 'bg-lavender-50' },
  { label: 'Time Saved / Day', value: '2-4h', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Productivity Boost', value: '40%', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Powered by', value: 'AI', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
];

export default function Dashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-lavender-50 border border-lavender-100 text-lavender-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3 h-3" />
          AI-Powered Workplace Tools
        </div>
        <h1 className="text-3xl font-bold text-slate-900 leading-tight">
          Good morning — let's get productive.
        </h1>
        <p className="text-slate-500 mt-2 text-base">
          Your AI assistant is ready to help you tackle today's work tasks faster and smarter.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-5">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: '1.1rem', height: '1.1rem' }} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Features */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Your AI Tools</h2>
        <p className="text-sm text-slate-500 mt-0.5">Select a tool to get started</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {features.map(({ to, icon: Icon, title, description, color, bg, border }) => (
          <Link key={to} to={to}>
            <Card className={`p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-2 ${border} group`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-amber-600 text-xs font-bold">!</span>
        </div>
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> AI-generated content may contain inaccuracies and should always be reviewed by a human before use in professional communications or decision-making.
        </p>
      </div>
    </div>
  );
}
