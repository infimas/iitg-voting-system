'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { submitPollRequest } from '@/lib/firestore';

export default function RequestPollForm() {
  const [currentUser, setCurrentUser] = useState(null);
  const [electionTitle, setElectionTitle] = useState('');
  const [manifesto, setManifesto] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
      setUserLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const requestDetails = {
      requesterName: currentUser.displayName,
      requesterEmail: currentUser.email,
      requesterUID: currentUser.uid,
      electionTitle,
      candidateDetails: {
        name: currentUser.displayName,
        description: manifesto,
        imageUrl,
      }
    };

    const result = await submitPollRequest(requestDetails);
    setLoading(false);

    if (result.success) {
      setSuccess('Your request has been submitted successfully! The admin will review it shortly.');
      setElectionTitle('');
      setManifesto('');
      setImageUrl('');
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Loading skeleton
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse max-w-2xl mx-auto">
            <div className="h-8 bg-blue-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-blue-100 rounded w-2/3 mb-8"></div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
              <div className="space-y-6">
                <div className="h-20 bg-blue-50 rounded-xl"></div>
                <div className="h-20 bg-blue-50 rounded-xl"></div>
                <div className="h-32 bg-blue-50 rounded-xl"></div>
                <div className="h-12 bg-blue-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg border border-blue-100 text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-500">Please log in to submit a candidacy request</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Request Election</h1>
          </div>
          <p className="text-lg text-gray-600 ml-16">
            Submit your candidacy request for upcoming IITG elections
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
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
              
              {/* Candidate Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Your Candidate Profile
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span className={imageUrl ? 'hidden' : ''}>
                      {getInitials(currentUser.displayName)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{currentUser.displayName}</p>
                    <p className="text-sm text-gray-600">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Election Title */}
              <div className="mb-6">
                <label htmlFor="electionTitle" className="flex items-center gap-2 text-gray-800 text-lg font-bold mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Election Position
                </label>
                <input
                  type="text"
                  id="electionTitle"
                  placeholder="e.g., General Secretary, Cultural Secretary, Hostel Secretary"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
                  value={electionTitle}
                  onChange={(e) => setElectionTitle(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">Specify the position you want to contest for</p>
              </div>

              {/* Profile Picture URL */}
              <div className="mb-6">
                <label htmlFor="imageUrl" className="flex items-center gap-2 text-gray-800 text-lg font-bold mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-2">Optional: Add a professional photo for your candidacy</p>
              </div>

              {/* Manifesto */}
              <div className="mb-8">
                <label htmlFor="manifesto" className="flex items-center gap-2 text-gray-800 text-lg font-bold mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Your Manifesto
                </label>
                <textarea
                  id="manifesto"
                  rows="6"
                  placeholder="Share your vision, goals, and key points that make you the right candidate for this position. What changes will you bring? What are your key promises to fellow students?"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-vertical"
                  value={manifesto}
                  onChange={(e) => setManifesto(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Write a compelling manifesto that highlights your qualifications and vision
                </p>
                <div className="mt-2 text-sm text-gray-400">
                  {manifesto.length}/1000 characters
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading || !currentUser}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  loading || !currentUser
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Submit Candidacy Request
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Your request will be reviewed by the election committee
              </p>
            </div>
          </form>

          {/* Info Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              What happens next?
            </h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Your request will be reviewed by the election committee</li>
              <li>• You'll receive an email confirmation within 24-48 hours</li>
              <li>• If approved, you'll be added to the candidate list</li>
              <li>• Campaign period will begin as per election schedule</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
