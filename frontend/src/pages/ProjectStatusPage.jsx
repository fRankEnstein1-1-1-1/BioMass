import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectStatus, downloadProjectAssets } from '../utils/api';
import Navbar from '../components/Navbar';
import { Loader2, CheckCircle, Download, Activity, AlertCircle } from 'lucide-react';

function ProjectStatusPage({ user, onLogout }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('processing');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let intervalId;
    let didTriggerDownload = false;

    const fetchStatus = async () => {
      try {
        const data = await getProjectStatus(projectId);
        if (data.success) {
          setProgress(data.progress);
          setStatus(data.projectStatus);

          if (data.projectStatus === 'completed' || data.projectStatus === 'failed') {
            clearInterval(intervalId);
            
            if (data.projectStatus === 'completed' && !didTriggerDownload) {
              didTriggerDownload = true;
              handleAutoDownload();
            }
          }
        }
      } catch (err) {
        console.error('Error fetching status:', err);
        setError('Failed to fetch status. Retrying...');
      }
    };

    fetchStatus();
    intervalId = setInterval(fetchStatus, 5000);

    return () => clearInterval(intervalId);
  }, [projectId]);

  const handleAutoDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadProjectAssets(projectId);
      setAssetsReady(true);
      setIsDownloading(false);
    } catch (err) {
      console.error('Error downloading assets:', err);
      setError('Processing finished, but failed to download assets.');
      setIsDownloading(false);
    }
  };

  const handleRunAnalysis = () => {
    navigate(`/project/${projectId}/results`);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <Navbar user={user} onLogout={onLogout} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#1e40af_0%,transparent_50%)] opacity-20 pointer-events-none" />
        
        <div className="w-full max-w-2xl z-10">
          <div className="glass-card rounded-3xl p-8 md:p-12 fade-in-up">
            
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
                {status === 'processing' && !isDownloading && <Loader2 size={28} className="text-blue-400 animate-spin" />}
                {status === 'completed' && !isDownloading && !assetsReady && <Loader2 size={28} className="text-blue-400 animate-spin" />}
                {isDownloading && <Download size={28} className="text-indigo-400 animate-bounce" />}
                {assetsReady && <CheckCircle size={28} className="text-green-400" />}
                {status === 'failed' && <AlertCircle size={28} className="text-red-400" />}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                {status === 'processing' ? 'Processing Images' : 
                 status === 'failed' ? 'Processing Failed' : 
                 isDownloading ? 'Downloading Assets' :
                 assetsReady ? 'Processing Complete!' : 'Status Unknown'}
              </h2>
              
              <p className="text-slate-400">
                {status === 'processing' ? 'WebODM is currently generating DSM and DTM models from your drone imagery. This may take a while.' : 
                 status === 'failed' ? 'There was an error processing your images.' : 
                 isDownloading ? 'Processing finished. Now securely downloading GeoTIFF assets to your server...' :
                 assetsReady ? 'Your assets are ready for environmental analysis.' : ''}
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle size={20} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {(status === 'processing' || isDownloading) && (
              <div className="mb-8">
                <div className="flex justify-between text-sm text-slate-300 mb-2 font-medium">
                  <span>{isDownloading ? 'Downloading...' : 'WebODM Progress'}</span>
                  <span>{isDownloading ? '...' : `${progress}%`}</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out"
                    style={{ width: isDownloading ? '100%' : `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {assetsReady && (
              <div className="mt-8 pt-8 border-t border-slate-700/50">
                <button 
                  onClick={handleRunAnalysis}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-medium shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                >
                  <Activity size={24} />
                  Run Environmental Analysis
                </button>
                <p className="text-center text-xs text-slate-500 mt-4">
                  This will calculate Canopy Area, Biomass, and Carbon Storage.
                </p>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProjectStatusPage;
