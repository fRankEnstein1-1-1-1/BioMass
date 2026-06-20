import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectsByUser, deleteProject } from '../utils/api';
import { Folder, CheckCircle, Clock, AlertCircle, Loader2, Trash2 } from 'lucide-react';

function ProjectList({ user }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProject(projectToDelete._id);
      setProjects((prev) => prev.filter(p => p._id !== projectToDelete._id));
      setProjectToDelete(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete project.');
      setProjectToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const data = await getProjectsByUser(user._id);
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} className="text-green-400" />;
      case 'processing':
      case 'uploaded':
        return <Clock size={18} className="text-blue-400" />;
      case 'failed':
        return <AlertCircle size={18} className="text-red-400" />;
      default:
        return <Folder size={18} className="text-slate-400" />;
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-6 fade-in-up">
        <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Your Projects</h3>
          <p className="text-sm text-slate-400 mt-1">
            View and analyze your previous drone uploads
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
          <p>Loading your projects...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-700/50 rounded-xl">
          <Folder size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="text-slate-400 text-lg">No projects found.</p>
          <p className="text-sm text-slate-500 mt-2">Create a new project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div 
              key={project._id} 
              className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all rounded-xl p-5 cursor-pointer flex flex-col justify-between"
              onClick={() => navigate(project.status === 'completed' ? `/project/${project._id}/results` : `/project/${project._id}/status`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-medium text-white truncate max-w-[200px]" title={project.projectName}>
                    {project.projectName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(project.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'short', day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-700">
                  {getStatusIcon(project.status)}
                  <span className="text-xs font-medium text-slate-300">
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-700/50">
                <span className="text-sm text-blue-400 font-medium hover:text-blue-300">View Details &rarr;</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setProjectToDelete(project); }}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-red-500/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 text-red-500 rounded-xl">
                <AlertCircle size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Project?</h3>
                <p className="text-slate-400 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-slate-300 mb-8">
              Are you sure you want to permanently delete <strong className="text-white">{projectToDelete.projectName}</strong>? All associated imagery and results will be lost.
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setProjectToDelete(null)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default ProjectList;
