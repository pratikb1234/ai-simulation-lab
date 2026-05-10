import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Download, AlertTriangle, Lightbulb, Users, ShieldAlert, FileText } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// --- FALLBACK MOCK DATA ---
const defaultSentimentData = [
  { name: 'Strongly Support', value: 35 },
  { name: 'Support', value: 20 },
  { name: 'Neutral', value: 15 },
  { name: 'Concerned', value: 20 },
  { name: 'Strongly Oppose', value: 10 },
];
const defaultAgreementData = [
  { subject: 'Pedagogical Value', A: 85, fullMark: 100 },
  { subject: 'Implementation Ease', A: 40, fullMark: 100 },
  { subject: 'Cost Efficiency', A: 60, fullMark: 100 },
  { subject: 'Student Engagement', A: 90, fullMark: 100 },
  { subject: 'Parent Acceptance', A: 55, fullMark: 100 },
];
const defaultConcernsData = [
  { name: 'Screen Time', count: 42 },
  { name: 'Data Privacy', count: 35 },
  { name: 'Teacher Workload', count: 28 },
  { name: 'Cost', count: 15 },
];
const defaultPersonas = [
  { id: 1, name: 'Sarah J.', role: 'Progressive IB Teacher', sentiment: 'Support', quote: 'This could save me hours of lesson planning if implemented correctly.' },
  { id: 2, name: 'Rajesh K.', role: 'Traditional Indian Parent', sentiment: 'Concerned', quote: 'Will this reduce their ability to think independently and write without a screen?' },
  { id: 3, name: 'Maya T.', role: 'High-performing DP Student', sentiment: 'Strongly Support', quote: 'Finally, a way to get personalized feedback instantly.' },
  { id: 4, name: 'David M.', role: 'School Owner', sentiment: 'Neutral', quote: 'I like the innovation, but what are the ongoing subscription costs and PD requirements?' },
];

const COLORS = ['#22c55e', '#86efac', '#e2e8f0', '#fca5a5', '#ef4444'];

export default function SimulationResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('executive'); // executive, charts, personas

  // Extracted live data or fallback to mock
  const liveData = location.state?.simulationData || {};
  const topic = location.state?.formData?.topic || "Should we introduce AI tools in Grade 5?";
  
  const overallSentimentScore = liveData.overallSentimentScore || 62;
  const sentimentLabel = liveData.sentimentLabel || "Cautiously Optimistic";
  const topRisk = liveData.topRisk || `"Screen time displacement of core writing skills"`;
  const strongestSupporter = liveData.strongestSupporter || `High-performing Students & Progressive Teachers`;
  
  const hiddenRisks = liveData.hiddenRisks || [
    { title: "Teacher Training Gap", description: "40% of simulated teachers felt anxious about their own competence in monitoring AI use." },
    { title: "Equity Concerns", description: "Budget-conscious parents expressed worry about required home subscriptions or hardware upgrades." }
  ];
  
  const recommendedStrategy = liveData.recommendedStrategy || [
    { title: "Lead with 'Enhancement, not Replacement'", description: "Communication to parents must explicitly state that handwriting remains core." },
    { title: "Pilot First", description: "Run a 4-week pilot in one subject before full deployment to build teacher confidence." }
  ];

  const sentimentData = liveData.sentimentData || defaultSentimentData;
  const agreementData = liveData.agreementData || defaultAgreementData;
  const concernsData = liveData.concernsData || defaultConcernsData;
  const personas = liveData.personas || defaultPersonas;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="bg-white border-b border-border/40 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-lg leading-tight">Simulation Results</h1>
            <p className="text-xs text-muted-foreground">{topic}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {location.state?.simulationData && (
             <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium mr-2">
               AI Generated Live
             </span>
          )}
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export PDF</Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-border/50 pb-px">
          {['executive', 'charts', 'personas'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {tab === 'executive' ? 'Executive Summary' : tab === 'charts' ? 'Analytics & Charts' : 'Persona Explorer'}
            </button>
          ))}
        </div>

        {activeTab === 'executive' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Overall Sentiment Score</h3>
                  <p className="text-4xl font-bold text-blue-900">{overallSentimentScore}/100</p>
                  <p className="text-sm text-blue-700 mt-2">{sentimentLabel}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-100">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-red-800 mb-1">Top Risk Detected</h3>
                  <p className="text-xl font-bold text-red-900 leading-tight mt-2">"{topRisk}"</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-emerald-800 mb-1">Strongest Supporter</h3>
                  <p className="text-xl font-bold text-emerald-900 leading-tight mt-2">{strongestSupporter}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3 border-none">
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Hidden Risks & Blind Spots</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {hiddenRisks.map((risk, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <p className="text-sm text-muted-foreground"><strong className="text-foreground">{risk.title}:</strong> {risk.description}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 border-none">
                  <CardTitle className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-blue-500" /> Recommended Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {recommendedStrategy.map((strat, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        <p className="text-sm text-muted-foreground"><strong className="text-foreground">{strat.title}:</strong> {strat.description}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stakeholder Agreement Matrix</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={agreementData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" textAnchor="middle" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Agreement" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Most Frequent Concerns</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={concernsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
                    <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'personas' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Simulated Stakeholder Panel</h2>
              <div className="text-sm text-muted-foreground border border-border px-3 py-1.5 rounded-lg bg-white shadow-sm">Showing {personas.length} generated personas</div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {personas.map((persona) => (
                <Card key={persona.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground border border-border/50">
                          {persona.name ? persona.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{persona.name}</h4>
                          <p className="text-xs text-muted-foreground">{persona.role}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        persona.sentiment?.includes('Support') ? 'bg-green-50 text-green-700 border-green-200' : 
                        persona.sentiment?.includes('Concern') || persona.sentiment?.includes('Oppose') ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {persona.sentiment}
                      </span>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg relative">
                      <div className="absolute top-2 left-2 text-border text-3xl font-serif">"</div>
                      <p className="text-sm text-foreground relative z-10 pl-4 italic">
                        {persona.quote}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="w-full text-xs h-8">View Full Profile</Button>
                      <Button variant="outline" size="sm" className="w-full text-xs h-8">Ask a Question</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
