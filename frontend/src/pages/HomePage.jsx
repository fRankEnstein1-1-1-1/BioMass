import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadSection from '../components/UploadSection';
import ProjectList from '../components/ProjectList';
import { FolderOpen, PlusCircle } from 'lucide-react';

const VIEW = {
  NONE: 'none',
  UPLOAD: 'upload',
  PROJECTS: 'projects',
};

function HomePage({ user, onLogout }) {
  const [activeView, setActiveView] = useState(VIEW.NONE);

  const toggle = (view) =>
    setActiveView((prev) => (prev === view ? VIEW.NONE : view));

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-1 flex flex-col items-center px-4 pt-20 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-white tracking-tight mb-2">
            Vegetation Biomass Analysis
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Upload drone imagery to begin automated biomass estimation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={() => toggle(VIEW.UPLOAD)}
            className={`btn-primary flex items-center gap-3 px-8 py-3.5 text-base font-medium rounded-2xl transition-all ${
              activeView === VIEW.UPLOAD ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <PlusCircle size={20} />
            New Project
          </button>

          <button
            onClick={() => toggle(VIEW.PROJECTS)}
            className={`btn-outline flex items-center gap-3 px-8 py-3.5 text-base font-medium rounded-2xl transition-all ${
              activeView === VIEW.PROJECTS ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <FolderOpen size={20} />
            View Projects
          </button>
        </div>

        {/* Conditional Content */}
        <div className="w-full max-w-4xl">
          {activeView === VIEW.UPLOAD && <UploadSection user={user} />}
          
          {activeView === VIEW.PROJECTS && <ProjectList user={user} />}
        </div>
      </main>
    </div>
  );
}

export default HomePage;