import { useState } from 'react';
import { Mail, Wand2, Copy, Check, RefreshCw } from 'lucide-react';
import { PageHeader, Card, OutputBox, LoadingSpinner, ErrorBanner, Label, Select, Textarea, Button, Input } from '@/components/ui';
import { useAI } from '@/hooks/useAI';

const tones = ['Professional', 'Friendly', 'Formal', 'Concise', 'Persuasive', 'Empathetic'];
const audiences = ['Team Member', 'Manager / Superior', 'Client / Customer', 'Executive', 'Partner / Vendor', 'New Hire'];
const purposes = ['Introduction', 'Follow-up', 'Request', 'Apology', 'Announcement', 'Feedback', 'Negotiation', 'Thank You'];

export default function EmailGenerator() {
  const { generate, loading, error } = useAI();
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('Professional');
  const [audience, setAudience] = useState('Team Member');
  const [purpose, setPurpose] = useState('Follow-up');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const input = `Write a ${tone.toLowerCase()} email for a ${audience.toLowerCase()}.
Purpose: ${purpose}
Subject: ${subject || 'Not specified'}
Additional context: ${context || 'None'}

Requirements:
- Subject line
- Professional greeting appropriate for the audience
- Clear, structured body paragraphs
- Appropriate closing
- Signature placeholder`;

    const result = await generate({ feature: 'email', input, context: { tone, audience, purpose } });
    if (result) setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title="Smart Email Generator"
        description="Generate professional emails tailored to tone, audience, and purpose."
        icon={<Mail className="w-6 h-6 text-lavender-600" />}
        iconBg="bg-lavender-100"
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Form */}
        <div className="col-span-2">
          <Card className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="tone">Tone</Label>
                <Select id="tone" value={tone} onChange={e => setTone(e.target.value)}>
                  {tones.map(t => <option key={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="audience">Audience</Label>
                <Select id="audience" value={audience} onChange={e => setAudience(e.target.value)}>
                  {audiences.map(a => <option key={a}>{a}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Select id="purpose" value={purpose} onChange={e => setPurpose(e.target.value)}>
                  {purposes.map(p => <option key={p}>{p}</option>)}
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="subject">Email Subject (optional)</Label>
              <Input
                id="subject"
                placeholder="e.g. Q4 Project Update - Action Required"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <Label htmlFor="context" required>What should this email be about?</Label>
              <Textarea
                id="context"
                rows={5}
                placeholder="Describe the key message, any relevant background, specific points to include, or any special instructions..."
                value={context}
                onChange={e => setContext(e.target.value)}
              />
            </div>

            <Button onClick={handleGenerate} disabled={loading || !context.trim()}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Generate Email</>
              )}
            </Button>
          </Card>

          {error && <ErrorBanner message={error} />}

          {loading && (
            <Card className="mt-4 p-4">
              <LoadingSpinner text="Crafting your email..." />
            </Card>
          )}

          {output && !loading && (
            <Card className="mt-4 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-700">Generated Email</p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleGenerate}>
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    {copied ? <><Check className="w-3 h-3 text-emerald-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </Button>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {output}
              </div>
              <p className="text-xs text-amber-600 mt-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                AI-generated content — please review before sending.
              </p>
            </Card>
          )}
        </div>

        {/* Tips */}
        <div className="col-span-1">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Tips for Best Results</h3>
            <ul className="space-y-3">
              {[
                'Be specific about the key message you want to convey.',
                'Mention any deadlines or urgency in the context.',
                'Include names or department for a personalized feel.',
                'Review and adjust the tone before sending.',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <span className="w-5 h-5 rounded-full bg-lavender-100 text-lavender-700 flex items-center justify-center flex-shrink-0 font-semibold text-[10px]">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 mt-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Tone Guide</h3>
            <div className="space-y-2">
              {[
                ['Professional', 'Balanced, clear, businesslike'],
                ['Formal', 'Structured, traditional, respectful'],
                ['Friendly', 'Warm, approachable, casual'],
                ['Concise', 'Brief, direct, to-the-point'],
                ['Persuasive', 'Compelling, motivated, action-driven'],
              ].map(([t, d]) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-700 w-24 flex-shrink-0">{t}</span>
                  <span className="text-xs text-slate-500">{d}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
