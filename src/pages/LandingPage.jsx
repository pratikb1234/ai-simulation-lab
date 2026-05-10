import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Users, Activity, BarChart3, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-foreground selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold tracking-tighter">S</div>
            <span className="font-semibold text-lg tracking-tight">SimLab</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost">Log In</Button>
            <Button asChild>
              <Link to="/dashboard">Run a Simulation</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Parent + Teacher + Student Simulation Lab
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-[1.1]">
              Stress-test educational decisions <span className="text-muted-foreground/50 italic font-light">before</span> launching them.
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Simulate parent, teacher, and student perspectives using AI-generated stakeholder panels. Discover blind spots, refine your strategy, and launch with confidence.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
              <Link to="/dashboard">
                Run a Simulation <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Sample Report
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <Feature 
              icon={<Users />}
              title="Stakeholder Simulation"
              description="Deploy synthetic panels of parents, teachers, and students tailored to your specific school context (IB, Cambridge, etc)."
            />
            <Feature 
              icon={<ShieldAlert />}
              title="Blind-Spot Detection"
              description="Identify hidden risks, edge-case concerns, and potential backlash before communicating your policy to the real world."
            />
            <Feature 
              icon={<BarChart3 />}
              title="Executive Insight Reports"
              description="Generate boardroom-ready summaries detailing overall sentiment, key objections, and strategic recommendations."
            />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-[#FAFAFA] border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center px-6">
          <p className="text-sm text-muted-foreground/70">
            <strong>Important Note:</strong> Synthetic simulations are designed for early-stage exploration and strategic thinking. Final decisions should always involve real stakeholder consultation.
          </p>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-primary border border-border/50">
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
