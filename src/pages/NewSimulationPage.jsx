import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Check, Users, Target, BookOpen, Key, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateBaseSimulationContext, generateIndividualPersonaReaction } from '../lib/gemini';

export default function NewSimulationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  
  const [formData, setFormData] = useState({
    topic: '',
    panel: '',
    context: '',
    scale: '10'
  });

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError("Please provide a Gemini API key.");
      return;
    }
    
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    setIsGenerating(true);
    setError(null);

    try {
      setGenerationProgress("Synthesizing dashboard analytics and mapping personas...");
      const baseData = await generateBaseSimulationContext(formData.topic, formData.panel, formData.context, parseInt(formData.scale), apiKey);
      
      const profilesToGenerate = baseData.personaProfilesToGenerate || [];
      const populatedPersonas = [];
      
      // Process in small batches of 5 to avoid 429 Too Many Requests
      const BATCH_SIZE = 5;
      for (let i = 0; i < profilesToGenerate.length; i += BATCH_SIZE) {
        const batch = profilesToGenerate.slice(i, i + BATCH_SIZE);
        setGenerationProgress(`Querying Gemini for individual reactions: ${i} to ${Math.min(i + BATCH_SIZE, profilesToGenerate.length)} of ${profilesToGenerate.length}...`);
        
        const batchResults = await Promise.all(
          batch.map(profile => generateIndividualPersonaReaction(formData.topic, formData.context, profile, apiKey))
        );
        populatedPersonas.push(...batchResults);
      }

      baseData.personas = populatedPersonas;
      delete baseData.personaProfilesToGenerate;

      // Navigate to results page and pass the data via state
      navigate('/simulation/new', { state: { simulationData: baseData, formData } });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate simulation. If you hit a rate limit, try generating 10 personas instead.");
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else handleGenerate();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="bg-white border-b border-border/40 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>Cancel</Button>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground hidden md:flex">
            <span className={step >= 1 ? 'text-primary' : ''}>1. Topic</span>
            <span className="text-border">/</span>
            <span className={step >= 2 ? 'text-primary' : ''}>2. Panel</span>
            <span className="text-border">/</span>
            <span className={step >= 3 ? 'text-primary' : ''}>3. Context</span>
            <span className="text-border">/</span>
            <span className={step >= 4 ? 'text-primary' : ''}>4. Scale</span>
            <span className="text-border">/</span>
            <span className={step >= 5 ? 'text-primary' : ''}>5. Generate</span>
          </div>
        </div>
        <Button onClick={handleNext} disabled={(step === 1 && !formData.topic) || isGenerating}>
          {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Working...</> : (step === 5 ? 'Run Simulation' : 'Next Step')}
        </Button>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">What decision are you testing?</h1>
                <p className="text-muted-foreground">Enter a policy, feature, or educational decision.</p>
              </div>
              <textarea
                className="w-full min-h-[150px] p-4 text-lg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none shadow-sm"
                placeholder="e.g., Should we introduce AI tools in Grade 5?"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                autoFocus
              />
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground mr-2">Examples:</span>
                {['Reduce homework in middle school', 'Laptops in PYP', 'Portfolio-based assessment'].map((ex) => (
                  <button
                    key={ex}
                    className="text-sm px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                    onClick={() => setFormData({ ...formData, topic: ex })}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Select Stakeholder Panel</h1>
                <p className="text-muted-foreground">Who should we simulate reactions from?</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: 'mixed', title: 'Mixed Panel', desc: 'Parents, Teachers & Students', icon: <Users /> },
                  { id: 'parents', title: 'Parents Only', desc: 'Various demographic backgrounds', icon: <Users /> },
                  { id: 'teachers', title: 'Teachers Only', desc: 'Different experience levels', icon: <BookOpen /> },
                  { id: 'leadership', title: 'School Leadership', desc: 'Coordinators and Principals', icon: <Target /> },
                ].map((option) => (
                  <SelectionCard
                    key={option.id}
                    title={option.title}
                    description={option.desc}
                    icon={option.icon}
                    selected={formData.panel === option.id}
                    onClick={() => setFormData({ ...formData, panel: option.id })}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Select School Context</h1>
                <p className="text-muted-foreground">Context drastically changes stakeholder reactions.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: 'ib', title: 'IB Continuum (PYP/MYP/DP)' },
                  { id: 'cambridge', title: 'Cambridge (IGCSE/A-Levels)' },
                  { id: 'premium_intl', title: 'Premium International' },
                  { id: 'urban_india', title: 'Indian Urban School (CBSE/ICSE)' },
                  { id: 'edtech', title: 'EdTech Product Testing' },
                ].map((option) => (
                  <SelectionCard
                    key={option.id}
                    title={option.title}
                    selected={formData.context === option.id}
                    onClick={() => setFormData({ ...formData, context: option.id })}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Select Simulation Scale</h1>
                <p className="text-muted-foreground">Note: Because we send a unique prompt to Gemini for each persona, large scales take longer and may hit free API rate limits.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: '10', title: '10 Personas', desc: 'Recommended. Takes ~10s.' },
                  { id: '25', title: '25 Personas', desc: 'Standard insight. Takes ~25s.' },
                  { id: '50', title: '50 Personas', desc: 'Takes ~1 minute. Risk of rate limit.' },
                  { id: '100', title: '100 Personas', desc: 'Enterprise API key required.' },
                ].map((option) => (
                  <SelectionCard
                    key={option.id}
                    title={option.title}
                    description={option.desc}
                    selected={formData.scale === option.id}
                    onClick={() => setFormData({ ...formData, scale: option.id })}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">API Configuration</h1>
                <p className="text-muted-foreground">This platform uses Google Gemini 2.5 Flash to generate live simulations.</p>
              </div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Key className="w-5 h-5" /> Gemini API Key
                  </div>
                  <input
                    type="password"
                    className="w-full p-3 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your key is stored locally in your browser's localStorage and is only sent directly to Google's API.
                  </p>
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}
                  {isGenerating && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col items-center justify-center gap-3 text-center">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-1" />
                      <span className="text-sm font-medium text-blue-900">{generationProgress}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function SelectionCard({ title, description, icon, selected, onClick }) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${selected ? 'border-primary ring-1 ring-primary shadow-md' : 'hover:border-primary/30'}`}
      onClick={onClick}
    >
      <CardContent className="p-6 flex items-start gap-4">
        {icon && <div className={`p-2 rounded-lg ${selected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{React.cloneElement(icon, { className: 'w-5 h-5' })}</div>}
        <div className="flex-1">
          <h3 className={`font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>{title}</h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {selected && <Check className="w-5 h-5 text-primary" />}
      </CardContent>
    </Card>
  );
}
