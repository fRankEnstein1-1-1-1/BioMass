import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, ImageIcon, Trash2, AlertCircle } from 'lucide-react';
import {
    uploadImages,
    createProject
} from '../utils/api';

function UploadSection({ user }) {     
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projectName, setProjectName] =
    useState('');

  const userId = user?._id;   
console.log(`user id is ${userId}`)
 
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setDone(false);
    setProgress(0);
    setError('');
    setSuccess('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });


  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };


  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setProgress(0);
    setDone(false);
    setError('');
    setSuccess('');
  };

const handleUpload = async () => {

    if (!files.length || uploading)
        return;

    if (!userId) {

        setError(
            "User ID missing. Please login again."
        );

        return;
    }

    if (!projectName.trim()) {

        setError(
            "Please enter project name"
        );

        return;
    }

    setUploading(true);

    setError('');

    setSuccess('');

    setProgress(0);

    try {

      
        const projectResponse =
            await createProject({

                projectName,

                userId
            });

        const projectId =
            projectResponse.project._id;

        console.log(
            "Created Project:",
            projectId
        );

      
        const formData =
            new FormData();

        files.forEach(({ file }) => {

            formData.append(
                'images',
                file
            );
        });

       
        const uploadResponse =
            await uploadImages(
                projectId,
                formData,
                (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                }
            );

        console.log(
            "Upload Response:",
            uploadResponse
        );

        setProgress(100);

        setDone(true);

        setSuccess(
            "✅ Project uploaded successfully. Redirecting to tracking..."
        );

        setTimeout(() => {
            navigate(`/project/${projectId}/status`);
        }, 1500);

    } catch (err) {

        console.error(err);

        const message =

            err.response?.data?.message ||

            err.message ||

            "Upload failed";

        setError(message);

        setProgress(0);

    } finally {

        setUploading(false);
    }
};
  return (
    <div className="glass-card rounded-2xl p-6 fade-in-up">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-white">New Project - Upload Drone Images</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            JPG, PNG supported • Max 20MB per image
          </p>
        </div>
        {files.length > 0 && (
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {files.length} selected
          </span>
        )}
      </div>

      <div className="mb-5">
  <label className="block text-sm text-slate-300 mb-2">
    Project Name
  </label>

  <input
    type="text"
    value={projectName}
    onChange={(e) =>
      setProjectName(e.target.value)
    }
    placeholder="Enter project name"
    className="
      w-full
      bg-slate-900
      border
      border-slate-700
      rounded-xl
      px-4
      py-3
      text-white
      outline-none
      focus:border-blue-500
    "
  />
</div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className="rounded-2xl p-12 text-center cursor-pointer transition-all border-2"
        style={{
          borderStyle: 'dashed',
          borderColor: isDragActive ? '#60a5fa' : 'rgba(96,165,250,0.25)',
          background: isDragActive ? 'rgba(59,130,246,0.08)' : 'rgba(15,23,42,0.6)',
        }}
      >
        <input {...getInputProps()} />
        <UploadCloud size={48} className="mx-auto mb-4 text-slate-500" />
        {isDragActive ? (
          <p className="text-blue-400 font-medium text-lg">Drop images here</p>
        ) : (
          <>
            <p className="text-slate-300">Drag & drop drone images or click to browse</p>
            <p className="text-xs text-slate-600 mt-2">Multiple files allowed</p>
          </>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-4 flex gap-3 items-center bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 flex gap-3 items-center bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-2xl">
          <UploadCloud size={20} />
          <span>{success}</span>
        </div>
      )}

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3">
          {files.map(({ id, file, preview }) => (
            <div key={id} className="relative group rounded-lg overflow-hidden aspect-square border border-slate-700">
              <img src={preview} alt={file.name} className="w-full h-full object-cover" />
              <button
                onClick={() => removeFile(id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 w-7 h-7 rounded-full flex items-center justify-center"
              >
                <X size={14} color="white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
      {(uploading || done) && (
        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>{done ? "Upload Complete" : "Uploading..."}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: done ? '#22c55e' : '#3b82f6',
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading || done}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 py-3.5 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all"
          >
            {uploading ? `Uploading... ${progress}%` : done ? "✓ Done" : "Upload Images to Server"}
          </button>

          <button
            onClick={clearAll}
            disabled={uploading}
            className="px-6 py-3.5 border border-slate-600 hover:border-slate-500 rounded-2xl flex items-center gap-2"
          >
            <Trash2 size={18} /> Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadSection;