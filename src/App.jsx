import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import NewSimulationPage from './pages/NewSimulationPage';
import SimulationResultsPage from './pages/SimulationResultsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-simulation" element={<NewSimulationPage />} />
          <Route path="/simulation/:id" element={<SimulationResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
