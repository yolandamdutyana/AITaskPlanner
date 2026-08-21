import { useState } from 'react';
import { Search, Wand2, Copy, Check, RefreshCw, BookOpen } from 'lucide-react';
import { PageHeader, Card, LoadingSpinner, ErrorBanner, Label, Select, Textarea, Button, Input } from '@/components/ui';
import { useAI } from '@/hooks/useAI';

const researchTypes = ['General Overview', 'Industry Analysis', 'Competitive Research', 'Technical Deep-Dive', 'Market Trends', 'Best Practices', 'Case Studies', 'How-To Guide'];
const outputLengths = ['Brief (3-5 key points)', 'Standard (comprehensive summary)', 'Detailed (in-depth analysis)'];

const exampleTopics = [
  'Remote team collaboration best practices',
  'AI trends in enterprise software 2025',
  'Effective negotiation strategies',
  'Data-driven decision making',
];

export default function ResearchAssistant() {
  const { generate, loading, error } = useAI();
  const [topic, setTopic] = useState('');
  const [researchType, setResearchType] = useState('General Overview');
  const [outputLength, setOutputLength] = useState('Standard (comprehensive summary)');
  const [additionalContext, setAdditionalContext] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const input = `Research the following topic and provide a ${researchType.toLowerCase()}.

Topic: ${topic}
Research Type: ${researchType}
Output Length: ${outputLength}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Structure your response as:
EXECUTIVE SUMMARY:
[2-3 sentence overview]

KEY FINDINGS:
- [finding 1]
- [finding 2]
- [finding 3]

DETAILED INSIGHTS:
[Comprehensive analysis broken into clear subsections]

PRACTICAL APPLICATIONS:
- [how this applies to professional work]

SOURCES TO EXPLORE:
- [suggested types of sources, reports, or authors to look into]

CONCLUSION:
[Key takeaway in 2-3 sentences]`;

    const result = await generate({ feature: 'research', input, context: { researchType, outputLength } });
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
        title="AI Research Assistant"
        description="Get structured insights, summaries, and key findings on any professional topic."
        icon={<Search className="w-6 h-6 text-amber-600" />}
        iconBg="bg-amber-100"
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6">
            <div className="mb-4">
              <Label htmlFor="topic" required>Research Topic</Label>
              <Input
                id="topic"
                placeholder="e.g. Effective strategies for remote team management"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
              {/* Quick examples */}
              <div className="flex flex-wrap gap-2 mt-2">
                {exampleTopics.map(t => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="text-xs text-lavender-600 bg-lavender-50 hover:bg-lavender-100 border border-lavender-100 px-2.5 py-1 rounded-full transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="researchType">Research Type</Label>
                <Select id="researchType" value={researchType} onChange={e => setResearchType(e.target.value)}>
                  {researchTypes.map(t => <option key={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <Label htmlFor="outputLength">Output Detail</Label>
                <Select id="outputLength" value={outputLength} onChange={e => setOutputLength(e.target.value)}>
                  {outputLengths.map(l => <option key={l}>{l}</option>)}
                </Select>
              </div>
            </div>

            <div className="mb-5">
              <Label htmlFor="context">Additional Context (optional)</Label>
              <Textarea
                id="context"
                rows={3}
                placeholder="Any specific angle, industry focus, or constraints to consider..."
                value={additionalContext}
                onChange={e => setAdditionalContext(e.target.value)}
              />
            </div>

            <Button onClick={handleGenerate} disabled={loading || !topic.trim()}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Researching...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Research This Topic</>
              )}
            </Button>
          </Card>

          {error && <ErrorBanner message={error} />}

          {loading && (
            <Card className="mt-4 p-4">
              <LoadingSpinner text="Gathering insights..." />
            </Card>
          )}

          {output && !loading && (
            <Card className="mt-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <p className="text-sm font-semibold text-slate-700">Research Report: {topic}</p>
                </div>
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
                AI-generated research — verify with authoritative sources before use.
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Research Types</h3>
            <div className="space-y-2">
              {[
                ['General Overview', 'Broad understanding of a topic'],
                ['Industry Analysis', 'Sector trends and dynamics'],
                ['Competitive Research', 'Compare approaches or players'],
                ['Technical Deep-Dive', 'In-depth technical details'],
                ['Best Practices', 'Proven methods and frameworks'],
              ].map(([type, desc]) => (
                <div
                  key={type}
                  className="p-2.5 rounded-lg border border-slate-100 cursor-pointer hover:border-amber-200 hover:bg-amber-50 transition-all"
                  onClick={() => setResearchType(type)}
                >
                  <p className="text-xs font-medium text-slate-800">{type}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
