'use client';

import { useState } from 'react';
import { createPoll } from '@/lib/firestore';
import { useRouter } from 'next/navigation';

export default function CreatePollForm() {
  const [question, setQuestion] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [candidates, setCandidates] = useState([
    { name: '', description: '', imageUrl: '' },
    { name: '', description: '', imageUrl: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleCandidateChange = (index, field, value) => {
    const newCandidates = [...candidates];
    newCandidates[index][field] = value;
    setCandidates(newCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, { name: '', description: '', imageUrl: '' }]);
  };

  const removeCandidate = (index) => {
    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (new Date(startTime) >= new Date(endTime)) {
      setError('End time must be after the start time.');
      return;
    }

    if (new Date(startTime) < new Date()) {
      setError('Start time cannot be in the past.');
      return;
    }

    const validCandidates = candidates.filter(candidate => candidate.name.trim());
    if (validCandidates.length < 2) {
      setError('At least 2 candidates are required.');
      return;
    }

    setLoading(true);
    const createdBy = "admin_user_placeholder";
    
    const result = await createPoll(question, validCandidates, createdBy, startTime, endTime);
    setLoading(false);

    if (result.success) {
      setSuccess('Election created successfully! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      setError(result.error);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Create New Election</h1>
          </div>
          <p className="text-lg text-gray-600 ml-16">
            Set up a new democratic election for IITG students
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            
            {/* Alert Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-8 mt-8 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-8 mt-8 rounded-lg">
                <div className="flex">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-800">{success}</p>
                </div>
              </div>
            )}

            <div className="p-8">
              {/* Election Question */}
              <div className="mb-8">
                <label htmlFor="question" className="flex items-center gap-2 text-gray-800 text-lg font-bold mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Election Title
                </label>
                <input
                  type="text"
                  id="question"
                  placeholder="e.g., General Secretary Election 2025, Cultural Secretary Selection"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">Enter a clear and descriptive title for your election</p>
              </div>

              {/* Time Interval Section */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Election Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div>
                    <label htmlFor="startTime" className="block text-gray-700 font-semibold mb-2">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      value={startTime}
                      min={getMinDateTime()}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-600 mt-1">When voting begins</p>
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-gray-700 font-semibold mb-2">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                      value={endTime}
                      min={startTime || getMinDateTime()}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-600 mt-1">When voting ends</p>
                  </div>
                </div>
              </div>

              {/* Candidates Section */}
              <div className="border-t border-gray-100 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                    Election Candidates
                  </h3>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {candidates.length} candidates
                  </span>
                </div>

                <div className="space-y-6">
                  {candidates.map((candidate, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-colors relative group">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          Candidate #{index + 1}
                        </h4>
                        {candidates.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeCandidate(index)}
                            className="opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-all duration-200"
                            title="Remove candidate"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Candidate Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Enter candidate's full name"
                            className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                            value={candidate.name}
                            onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Profile Picture URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/photo.jpg"
                            className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                            value={candidate.imageUrl}
                            onChange={(e) => handleCandidateChange(index, 'imageUrl', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Manifesto / Key Points
                        </label>
                        <textarea
                          placeholder="Enter candidate's manifesto, key points, or campaign promises..."
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-vertical"
                          rows="3"
                          value={candidate.description}
                          onChange={(e) => handleCandidateChange(index, 'description', e.target.value)}
                        />
                      </div>

                      {/* Preview Image */}
                      {candidate.imageUrl && (
                        <div className="mt-4 flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <img
                            src={candidate.imageUrl}
                            alt={`${candidate.name} preview`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <span className="text-sm text-gray-600">Image preview</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addCandidate}
                  className="mt-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-xl transition-colors border-2 border-dashed border-blue-200 hover:border-blue-300 w-full justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Another Candidate
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  loading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Creating Election...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Create Election
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Review all details before creating the election
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
