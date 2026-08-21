import { useState } from 'react';
import { CheckSquare, Wand2, Plus, Trash2, GripVertical } from 'lucide-react';
import { PageHeader, Card, LoadingSpinner, ErrorBanner, Label, Select, Textarea, Button, Input } from '@/components/ui';
import { useAI } from '@/hooks/useAI';

interface Task {
  id: string;
  title: string;
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
}

const priorities = ['High', 'Medium', 'Low'] as const;
const durations = ['15 min', '30 min', '1 hour', '2 hours', '3+ hours'];
const workingHours = ['8 hours (9-5)', '6 hours (focused)', '4 hours (half-day)', 'Custom'];

const priorityColors = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

export default function TaskPlanner() {
  const { generate, loading, error } = useAI();
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: '', duration: '1 hour', priority: 'Medium' },
  ]);
  const [workHours, setWorkHours] = useState('8 hours (9-5)');
  const [goals, setGoals] = useState('');
  const [output, setOutput] = useState('');

  const addTask = () => {
    setTasks(prev => [...prev, { id: Date.now().toString(), title: '', duration: '1 hour', priority: 'Medium' }]);
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleGenerate = async () => {
    const validTasks = tasks.filter(t => t.title.trim());
    if (!validTasks.length) return;

    const taskList = validTasks.map((t, i) =>
      `${i + 1}. ${t.title} (${t.duration}, Priority: ${t.priority})`
    ).join('\n');

    const input = `Create an optimized daily schedule and task prioritization plan.

Tasks:
${taskList}

Working Hours: ${workHours}
Goals for today: ${goals || 'Not specified'}

Please provide:
1. PRIORITIZED TASK ORDER: Ranked list with reasoning
2. SUGGESTED SCHEDULE: Time-blocked daily plan
3. PRODUCTIVITY TIPS: 2-3 specific tips for this workload
4. FOCUS BLOCKS: Recommended deep work sessions

Format it clearly with sections.`;

    const result = await generate({ feature: 'task', input, context: { workHours } });
    if (result) setOutput(result);
  };

  return (
    <div>
      <PageHeader
        title="AI Task Planner"
        description="Add your tasks and get a prioritized, time-blocked schedule optimized for productivity."
        icon={<CheckSquare className="w-6 h-6 text-violet-600" />}
        iconBg="bg-violet-100"
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6">
            {/* Task list */}
            <div className="mb-5">
              <Label required>Your Tasks for Today</Label>
              <div className="space-y-2.5 mt-1">
                {tasks.map((task, index) => (
                  <div key={task.id} className="flex items-center gap-2 group">
                    <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <span className="text-xs text-slate-400 w-5 flex-shrink-0 text-center font-medium">{index + 1}</span>
                    <Input
                      placeholder="Task name..."
                      value={task.title}
                      onChange={e => updateTask(task.id, 'title', e.target.value)}
                      className="flex-1"
                    />
                    <Select
                      value={task.duration}
                      onChange={e => updateTask(task.id, 'duration', e.target.value)}
                      className="w-20 flex-shrink-0"
                    >
                      {durations.map(d => <option key={d}>{d}</option>)}
                    </Select>
                    <Select
                      value={task.priority}
                      onChange={e => updateTask(task.id, 'priority', e.target.value as Task['priority'])}
                      className="w-24 flex-shrink-0"
                    >
                      {priorities.map(p => <option key={p}>{p}</option>)}
                    </Select>
                    <button
                      onClick={() => removeTask(task.id)}
                      disabled={tasks.length === 1}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-3" onClick={addTask}>
                <Plus className="w-3.5 h-3.5" /> Add Task
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <Label htmlFor="workHours">Working Hours Today</Label>
                <Select id="workHours" value={workHours} onChange={e => setWorkHours(e.target.value)}>
                  {workingHours.map(h => <option key={h}>{h}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="goals">Main Goal for Today (optional)</Label>
                <Input
                  id="goals"
                  placeholder="e.g. Finish the Q4 report"
                  value={goals}
                  onChange={e => setGoals(e.target.value)}
                />
              </div>
            </div>

            {/* Priority overview */}
            <div className="flex gap-2 mb-5 p-3 bg-slate-50 rounded-lg">
              {priorities.map(p => {
                const count = tasks.filter(t => t.priority === p && t.title.trim()).length;
                return (
                  <span key={p} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${priorityColors[p]}`}>
                    {p}: {count}
                  </span>
                );
              })}
              <span className="text-xs text-slate-400 ml-auto self-center">
                {tasks.filter(t => t.title.trim()).length} tasks total
              </span>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !tasks.some(t => t.title.trim())}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Planning...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Generate Plan</>
              )}
            </Button>
          </Card>

          {error && <ErrorBanner message={error} />}

          {loading && (
            <Card className="mt-4 p-4">
              <LoadingSpinner text="Optimizing your schedule..." />
            </Card>
          )}

          {output && !loading && (
            <Card className="mt-4 p-6">
              <p className="text-sm font-semibold text-slate-700 mb-3">Your Optimized Plan</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {output}
              </div>
              <p className="text-xs text-amber-600 mt-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                AI-generated schedule — adapt to your actual workday as needed.
              </p>
            </Card>
          )}
        </div>

        {/* Tips */}
        <div>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Priority Guide</h3>
            <div className="space-y-3">
              {[
                { p: 'High' as const, label: 'High Priority', desc: 'Urgent & important, do first' },
                { p: 'Medium' as const, label: 'Medium Priority', desc: 'Important but flexible timing' },
                { p: 'Low' as const, label: 'Low Priority', desc: 'Nice to do, schedule last' },
              ].map(({ p, label, desc }) => (
                <div key={p} className="flex items-start gap-2.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded border ${priorityColors[p]} flex-shrink-0`}>{p}</span>
                  <div>
                    <p className="text-xs font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 mt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Productivity Tips</h3>
            <ul className="space-y-2">
              {[
                'Schedule high-priority tasks in your peak energy hours.',
                'Group similar tasks together to minimize context switching.',
                'Include short breaks between focus blocks.',
              ].map((tip, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-violet-500 mt-0.5 flex-shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
