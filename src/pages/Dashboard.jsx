import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Clock, FileText, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const recentSimulations = [
    { id: '1', title: 'Should we introduce AI tools in Grade 5?', date: '2 hours ago', status: 'Completed', stakeholders: 50 },
    { id: '2', title: 'Transition to portfolio-based assessment', date: 'Yesterday', status: 'Completed', stakeholders: 100 },
    { id: '3', title: 'Reduce homework in middle school', date: '3 days ago', status: 'Draft', stakeholders: 25 },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your simulations and view insights.</p>
          </div>
          <Button asChild className="gap-2">
            <Link to="/new-simulation">
              <Plus className="w-4 h-4" /> New Simulation
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Simulations" value="12" icon={<FileText />} trend="+2 this week" />
          <StatCard title="Stakeholders Simulated" value="1,450" icon={<Clock />} trend="Across all panels" />
          <StatCard title="Active Risks Detected" value="8" icon={<FileText />} trend="Requires attention" />
        </div>

        <h2 className="text-xl font-semibold mb-6 tracking-tight">Recent Activity</h2>
        <div className="grid gap-4">
          {recentSimulations.map((sim) => (
            <Card key={sim.id} className="hover:border-primary/20 transition-colors group">
              <CardContent className="p-0">
                <Link to={`/simulation/${sim.id}`} className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="font-semibold text-lg text-primary group-hover:text-blue-600 transition-colors">{sim.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {sim.date}</span>
                      <span>•</span>
                      <span>{sim.stakeholders} personas</span>
                      <span>•</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">{sim.status}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-muted rounded-lg text-primary">{React.cloneElement(icon, { className: 'w-5 h-5' })}</div>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}
