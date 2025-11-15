import { useState, useRef } from 'react';
import Header from "../components/Header.jsx";
import VideoBackground from "../components/VideoBackground.jsx";

export default function TranscribePage() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pillar, setPillar] = useState('');
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);

  const pillars = [
    { name: 'AI', color: 'bg-blue-500', icon: '🤖' },
    { name: 'Finance', color: 'bg-green-500', icon: '💰' },
    { name: 'Science', color: 'bg-purple-500', icon: '🔬' },
    { name: 'Culture', color: 'bg-orange-500', icon: '🎨' }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTranscribe = async () => {
    if (!file) {
      setError('Please select an audio or video file');
      return;
    }

    setLoading(true);
    setError('');
    setTranscription('');

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('http://localhost:3000/transcribe/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transcription failed');
      }

      const newTranscription = {
        id: Date.now(),
        text: data.text,
        fileName: file.name,
        pillar: pillar || 'Uncategorized',
        timestamp: new Date().toLocaleString()
      };

      setTranscription(data.text);
      setHistory([newTranscription, ...history]);
    } catch (err) {
      setError(err.message || 'Failed to transcribe audio');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('✅ Transcription copied to clipboard!');
  };

  const handleDownload = (text, fileName) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}_transcription.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteHistory = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/videos/nk-bg-optimized.mp4" type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-black/70 overflow-y-auto">
        <div className="container mx-auto px-4 py-20">
          {/* Hero Header */}
          <div className="text-center mb-12 pt-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#ffd166] mb-4 drop-shadow-lg">
              Transform Knowledge into Action
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Upload audio or video content about AI, Finance, Science, or Culture and get instant, searchable transcriptions powered by Whisper AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Transcription Area */}
            <div className="lg:col-span-2">
              <div className="bg-[#ffd166] rounded-lg shadow-2xl p-8">
                {/* Pillar Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Select Pillar (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {pillars.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setPillar(p.name)}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          pillar === p.name
                            ? `${p.color} text-white scale-105 shadow-lg`
                            : 'bg-white text-gray-800 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-xl mr-2">{p.icon}</span>
                        {p.name}
                      </button>
                    ))}
                  </div>
                  {pillar && (
                    <button
                      onClick={() => setPillar('')}
                      className="mt-3 px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {/* File Upload */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-gray-400 rounded-lg p-12 mb-6 text-center cursor-pointer hover:border-gray-600 hover:bg-[#ffd166]/50 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <svg className="mx-auto h-20 w-20 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>

                  {file ? (
                    <div>
                      <p className="text-xl font-bold text-gray-900 mb-2">{file.name}</p>
                      <p className="text-sm text-gray-700">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        Drop your audio/video file here
                      </p>
                      <p className="text-sm text-gray-700">
                        or click to browse • Supports MP3, WAV, MP4, WebM, and more (max 20MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Video Preview (16:9) */}
                {file && file.type.startsWith('video/') && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Video Preview
                    </label>
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="w-full aspect-video rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Transcribe Button */}
                <button
                  onClick={handleTranscribe}
                  disabled={loading || !file}
                  className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
                    loading || !file
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-[#1a1a1a] text-[#ffd166] hover:bg-[#333333] hover:scale-105 shadow-lg'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Transcribing...
                    </span>
                  ) : (
                    'Transcribe Audio'
                  )}
                </button>

                {/* Current Transcription Result */}
                {transcription && (
                  <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Transcription Result
                        {pillar && (
                          <span className="ml-2 text-base font-semibold text-gray-600">
                            ({pillar})
                          </span>
                        )}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(transcription)}
                          className="px-4 py-2 bg-[#1a1a1a] text-[#ffd166] rounded-lg font-semibold hover:bg-[#333333] transition-colors"
                        >
                          📋 Copy
                        </button>
                        <button
                          onClick={() => handleDownload(transcription, file.name)}
                          className="px-4 py-2 bg-[#1a1a1a] text-[#ffd166] rounded-lg font-semibold hover:bg-[#333333] transition-colors"
                        >
                          💾 Download
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {transcription}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* History Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#ffd166] rounded-lg shadow-2xl p-6 sticky top-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  📚 History
                </h3>
                {history.length === 0 ? (
                  <p className="text-gray-700 text-center py-8">
                    No transcriptions yet. Upload a file to get started!
                  </p>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-4 shadow-md">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm truncate">
                              {item.fileName}
                            </p>
                            <p className="text-xs text-gray-600">{item.timestamp}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteHistory(item.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="mb-2">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${
                            pillars.find(p => p.name === item.pillar)?.color || 'bg-gray-500'
                          }`}>
                            {item.pillar}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 line-clamp-3 mb-2">
                          {item.text}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(item.text)}
                            className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => handleDownload(item.text, item.fileName)}
                            className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
