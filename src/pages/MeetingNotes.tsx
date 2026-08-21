import { useState } from 'react';
import { FileText, Wand2, Copy, Check, RefreshCw } from 'lucide-react';
import { PageHeader, Card, LoadingSpinner, ErrorBanner, Label, Select, Textarea, Button } from '@/components/ui';
import { useAI } from '@/hooks/useAI';

const meetingTypes = ['Team Standup', 'Project Kickoff', 'Client Meeting', 'Brainstorm Session', 'Strategy Review', 'One-on-One', 'All-Hands', 'Retrospective'];

interface ParsedSummary {
  overview: string;
  keyPoints: string[];
  actionItems: string[];
  decisions: string[];
  deadlines: string[];
}

function parseSummary(raw: string): ParsedSummary | null {
  try {
    const overview = raw.match(/(?:OVERVIEW|Summary)[:\s]+([\s\S]*?)(?=\n[A-Z]|\n\n[A-Z]|$)/i)?.[1]?.trim() ?? '';
    const extractList = (label: string) => {
      const match = raw.match(new RegExp(`(?:${label})[:\\s]+([\\s\\S]*?)(?=\\n[A-Z\\d]|\\n\\n[A-Z\\d]|$)`, 'i'));
      if (!match) return [];
      return match[1].split('\n').map(l => l.replace(/^[-•*\d.]+\s*/, '').trim()).filter(Boolean);
    };
    return {
      overview,
      keyPoints: extractList('KEY POINTS?|KEY DISCUSSION POINTS?'),
      actionItems: extractList('ACTION ITEMS?'),
      decisions: extractList('DECISIONS? MADE?'),
      deadlines: extractList('DEADLINES?|DUE DATES?'),
    };
  } catch {
    return null;
  }
}

export default function MeetingNotes() {
  const { generate, loading, error } = useAI();
  const [notes, setNotes] = useState('');
  const [meetingType, setMeetingType] = useState('Team Standup');
  const [rawOutput, setRawOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const input = `Summarize the following ${meetingType} meeting notes into a structured summary.

Raw Notes:
${notes}

Format your response with these exact sections:
OVERVIEW:
[2-3 sentence summary of the meeting]

KEY POINTS:
- [point 1]
- [point 2]

ACTION ITEMS:
- [person responsible: action] or [action item]

DECISIONS MADE:
- [decision 1]

DEADLINES:
- [deadline / due date]`;

    const result = await generate({ feature: 'meeting', input, context: { meetingType } });
    if (result) setRawOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parsed = rawOutput ? parseSummary(rawOutput) : null;

  return (
    <div>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste raw meeting notes and get a structured summary with actions and deadlines."
        icon={<FileText className="w-6 h-6 text-emerald-600" />}
        iconBg="bg-emerald-100"
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6">
            <div className="mb-4">
              <Label htmlFor="meetingType">Meeting Type</Label>
              <Select id="meetingType" value={meetingType} onChange={e => setMeetingType(e.target.value)}>
                {meetingTypes.map(t => <option key={t}>{t}</option>)}
              </Select>
            </div>

            <div className="mb-5">
              <Label htmlFor="notes" required>Meeting Notes</Label>
              <Textarea
                id="notes"
                rows={10}
                placeholder="Paste your raw meeting notes here — attendees, discussion points, decisions, next steps, anything discussed..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-1.5">{notes.length} characters</p>
            </div>

            <Button onClick={handleGenerate} disabled={loading || !notes.trim()}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Summarizing...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Summarize Notes</>
              )}
            </Button>
          </Card>

          {error && <ErrorBanner message={error} />}

          {loading && (
            <Card className="mt-4 p-4">
              <LoadingSpinner text="Analyzing meeting notes..." />
            </Card>
          )}

          {rawOutput && !loading && (
            <div className="mt-4 space-y-4">
              {/* Structured view if parsed */}
              {parsed && (
                <>
                  {parsed.overview && (
                    <Card className="p-5">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Overview</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">{parsed.overview}</p>
                    </Card>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {parsed.keyPoints.length > 0 && (
                      <Card className="p-5">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Points</h3>
                        <ul className="space-y-2">
                          {parsed.keyPoints.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                    {parsed.actionItems.length > 0 && (
                      <Card className="p-5">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Action Items</h3>
                        <ul className="space-y-2">
                          {parsed.actionItems.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="w-4 h-4 rounded border-2 border-emerald-400 flex-shrink-0 mt-0.5" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                    {parsed.decisions.length > 0 && (
                      <Card className="p-5">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Decisions Made</h3>
                        <ul className="space-y-2">
                          {parsed.decisions.map((d, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="text-emerald-600 font-bold text-xs mt-0.5 flex-shrink-0">✓</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                    {parsed.deadlines.length > 0 && (
                      <Card className="p-5">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Deadlines</h3>
                        <ul className="space-y-2">
                          {parsed.deadlines.map((d, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="text-amber-500 flex-shrink-0 mt-0.5">⏰</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </div>
                </>
              )}

              {/* Raw fallback */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-700">Full Summary</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={handleGenerate}>
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleCopy}>
                      {copied ? <><Check className="w-3 h-3 text-emerald-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {rawOutput}
                </div>
                <p className="text-xs text-amber-600 mt-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                  AI-generated — verify accuracy with meeting participants.
                </p>
              </Card>
            </div>
          )}
        </div>

        {/* Tips */}
        <div>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">What You'll Get</h3>
            <ul className="space-y-3">
              {[
                ['Overview', 'Quick 2-3 sentence summary'],
                ['Key Points', 'Main discussion highlights'],
                ['Action Items', 'Tasks and responsibilities'],
                ['Decisions', 'Agreed outcomes'],
                ['Deadlines', 'Dates and timeframes'],
              ].map(([title, desc]) => (
                <li key={title} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-700">{title}</span>
                  <span className="text-xs text-slate-500">{desc}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 mt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Best Practices</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Include attendee names, discussion points, and any specific numbers or dates in your raw notes for the most accurate summary.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
