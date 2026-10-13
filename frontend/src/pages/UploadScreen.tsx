import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle, Loader2, ArrowRight, Printer } from 'lucide-react';
import { usePrintOrder } from '../context/PrintOrderContext';
import { documentApi } from '../services/api';
import { UploadedDocument } from '../types';

export const UploadScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedMachine, selectedDocuments, addDocument, removeDocument } = usePrintOrder();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 50 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 50MB limit`);
        }

        const uploadedDoc = await documentApi.uploadDocument(file);
        addDocument(uploadedDoc);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const getFileIcon = (mimeType: string, filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return (
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
          PDF
        </div>
      );
    }
    if (ext === 'doc' || ext === 'docx') {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
          DOC
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
        <ImageIcon className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] max-w-md mx-auto flex flex-col justify-between p-5">
      <div>
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl font-bold">←</span>
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#101735]">Upload Documents</h1>
            <p className="text-xs text-[#64748B]">Supported: PDF, DOC, DOCX, JPG, PNG</p>
          </div>
        </div>

        {/* Selected Machine Pill */}
        {selectedMachine && (
          <div className="mb-5 p-3.5 bg-[#F1EDFF] rounded-2xl border border-indigo-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#5835F5] text-white flex items-center justify-center text-sm shadow-xs shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-[#101735] truncate">{selectedMachine.machineName}</h2>
              <p className="text-[11px] text-[#64748B] truncate">{selectedMachine.locationDescription}</p>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700 text-xs font-semibold animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag and Drop Upload Card */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-200 hover:border-[#5835F5] bg-white rounded-3xl p-8 text-center cursor-pointer transition-all hover:bg-indigo-50/20 active:scale-99 group mb-6 shadow-xs"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="w-16 h-16 rounded-3xl bg-[#F1EDFF] text-[#5835F5] flex items-center justify-center mx-auto mb-3.5 group-hover:scale-110 transition-transform shadow-inner">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <h3 className="text-sm font-extrabold text-[#101735]">
            {uploading ? 'Analyzing Document Pages...' : 'Tap to select files or drag and drop'}
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Real page count is extracted automatically on upload
          </p>
        </div>

        {/* Uploaded Documents List */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Uploaded Files ({selectedDocuments.length})
            </h3>
            {selectedDocuments.length > 0 && (
              <span className="text-xs font-semibold text-[#5835F5]">
                {selectedDocuments.reduce((sum, d) => sum + d.pageCount, 0)} total pages
              </span>
            )}
          </div>

          {selectedDocuments.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 bg-white/60 rounded-2xl border border-gray-100">
              No files selected yet. Tap above to upload.
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs flex items-center justify-between group animate-fadeIn"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getFileIcon(doc.detectedMimeType, doc.originalFilename)}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#101735] truncate max-w-[200px]">
                        {doc.originalFilename}
                      </h4>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        {doc.formattedSize} • <span className="font-bold text-[#5835F5]">{doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove document"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Continue Action */}
      <div className="pt-6">
        <button
          onClick={() => navigate('/options')}
          disabled={selectedDocuments.length === 0 || uploading}
          className="w-full py-4 rounded-2xl bg-[#5835F5] hover:bg-[#4020D8] text-white font-bold text-sm shadow-xl shadow-indigo-200 active:scale-98 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <span>Continue to Print Options</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
