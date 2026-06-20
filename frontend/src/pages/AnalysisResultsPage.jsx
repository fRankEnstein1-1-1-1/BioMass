import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { runEnvironmentalAnalysis } from '../utils/api';
import Navbar from '../components/Navbar';
import { Loader2, AlertCircle, Leaf, Activity, TreePine, Wind, ArrowLeft } from 'lucide-react';
import OrthophotoMap from '../components/OrthophotoMap';

function AnalysisResultsPage({ user, onLogout }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const data = await runEnvironmentalAnalysis(projectId);
        if (data.success) {
          setResults(data);
        }
      } catch (err) {
        console.error("Analysis Error:", err);
        setError("Failed to run analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [projectId]);

  const MetricCard = ({ title, value, unit, icon: Icon, colorClass, delay }) => (
    <div className={`glass-card rounded-2xl p-6 fade-in-up flex flex-col justify-between`} style={{ animationDelay: delay }}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl ${colorClass.split(' ')[0]} bg-opacity-20 backdrop-blur-md border border-white/10`}>
          <Icon size={24} className={colorClass.split(' ')[1]} />
        </div>
        <h3 className="text-slate-300 font-medium">{title}</h3>
      </div>
      <div>
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-slate-400 ml-2">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 pt-28 pb-12 relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <Loader2 size={64} className="text-blue-500 animate-spin" />
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse" />
            </div>
            <h2 className="text-2xl font-semibold text-white mt-8 mb-2">Crunching Data...</h2>
            <p className="text-slate-400 text-center max-w-md">Running complex environmental algorithms on your GeoTIFF models to extract biomass and carbon metrics.</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl text-center max-w-lg mx-auto mt-20">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Analysis Failed</h2>
            <p className="text-slate-400">{error}</p>
          </div>
        ) : results ? (
          <>
            <div className="mb-10 text-center md:text-left fade-in-up">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Environmental Analysis Results</h1>
              <p className="text-slate-400 text-lg">Detailed metrics calculated from your drone imagery.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Metrics */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <MetricCard 
                  title="Total Canopy Area" 
                  value={results.canopyArea?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'} 
                  unit="m²" 
                  icon={Leaf} 
                  colorClass="bg-green-500/20 text-green-400"
                  delay="0ms"
                />

                <MetricCard 
                  title="Canopy Coverage" 
                  value={results.canopyPercentage?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'} 
                  unit="%" 
                  icon={Leaf} 
                  colorClass="bg-emerald-500/20 text-emerald-400"
                  delay="100ms"
                />

                <MetricCard 
                  title="Mean Veg Height" 
                  value={results.meanHeight?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'} 
                  unit="m" 
                  icon={Activity} 
                  colorClass="bg-blue-500/20 text-blue-400"
                  delay="200ms"
                />

                <MetricCard 
                  title="Max Veg Height" 
                  value={results.maxHeight?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'} 
                  unit="m" 
                  icon={Activity} 
                  colorClass="bg-indigo-500/20 text-indigo-400"
                  delay="300ms"
                />

                <MetricCard 
                  title="Estimated Biomass" 
                  value={results.biomassEstimate?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'} 
                  unit="tons" 
                  icon={TreePine} 
                  colorClass="bg-orange-500/20 text-orange-400"
                  delay="400ms"
                />

                <MetricCard 
                  title="Carbon Storage" 
                  value={results.carbonEstimate?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'} 
                  unit="tons" 
                  icon={Wind} 
                  colorClass="bg-teal-500/20 text-teal-400"
                  delay="500ms"
                />
              </div>

              {/* Right Column: Interactive Map */}
              <div className="lg:col-span-7 fade-in-up h-full min-h-[500px]" style={{ animationDelay: '600ms' }}>
                <OrthophotoMap orthophotoUrl={results.orthophotoUrl} />
              </div>

            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default AnalysisResultsPage;
