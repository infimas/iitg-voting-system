'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getPollById, submitVote, getUserData } from '@/lib/firestore';
import PollChart from '@/components/polls/PollChart';

export default function ElectionPage() {
  const params = useParams();
  const router = useRouter();
  const { pollId } = params;

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [view, setView] = useState('voting');
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userData = await getUserData(user.uid);
          const hasVoted = !!(userData?.votedPolls && userData.votedPolls[pollId]);
          setUserHasVoted(hasVoted);
          if (hasVoted || (poll && !isPollActive(poll))) {
            setView('results');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });

    async function fetchPoll() {
      if (!pollId) return;
      try {
        const { poll: fetchedPoll, error: fetchError } = await getPollById(pollId);
        if (fetchError) {
          setError("Could not find this election.");
        } else {
          setPoll(fetchedPoll);
          const auth = getAuth();
          const userData = auth.currentUser ? await getUserData(auth.currentUser.uid) : null;
          const hasVoted = !!(userData?.votedPolls && userData.votedPolls[pollId]);
          if (hasVoted || !isPollActive(fetchedPoll)) {
            setView('results');
          }
        }
      } catch (error) {
        setError("Failed to load election data.");
        console.error('Error fetching poll:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPoll();
    return () => unsubscribe();
  }, [pollId]);

  const handleVote = async (optionIndex) => {
    if (!currentUser || userHasVoted || voting) return;
    
    setVoting(true);
    try {
      const result = await submitVote(pollId, optionIndex, currentUser.uid);

      if (result.success) {
        setUserHasVoted(true);
        setView('results');
        const { poll: updatedPoll } = await getPollById(pollId);
        setPoll(updatedPoll);
      } else {
        alert(result.error || 'Failed to submit vote. Please try again.');
      }
    } catch (error) {
      console.error('Voting error:', error);
      alert('An error occurred while submitting your vote.');
    } finally {
      setVoting(false);
    }
  };

  const isPollActive = (currentPoll) => {
    if (!currentPoll?.startTime || !currentPoll?.endTime) return false;
    const now = new Date();
    const start = currentPoll.startTime.toDate();
    const end = currentPoll.endTime.toDate();
    return now >= start && now <= end;
  };

  const getElectionStatus = (currentPoll) => {
    if (!currentPoll?.startTime || !currentPoll?.endTime) return { status: 'unknown', text: 'Election status unknown', color: 'text-gray-500' };
    
    const now = new Date();
    const start = currentPoll.startTime.toDate();
    const end = currentPoll.endTime.toDate();
    
    if (now < start) {
      return { 
        status: 'upcoming', 
        text: `Election starts on ${start.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
        color: 'text-blue-600'
      };
    } else if (now >= start && now <= end) {
      return { 
        status: 'active', 
        text: `Election is live! Voting ends on ${end.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })} at ${end.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
        color: 'text-green-600'
      };
    } else {
      return { 
        status: 'ended', 
        text: `Election ended on ${end.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}`,
        color: 'text-red-600'
      };
    }
  };

  const ViewToggle = ({ currentView, onViewChange, isActive, hasVoted }) => (
    <div className="flex bg-blue-50 rounded-2xl p-1 max-w-fit mx-auto mb-8">
      <button
        onClick={() => onViewChange('voting')}
        className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
          currentView === 'voting'
            ? 'bg-blue-500 text-white shadow-md'
            : 'text-blue-600 hover:bg-blue-100'
        }`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
        </svg>
        View Candidates
      </button>
      <button
        onClick={() => onViewChange('results')}
        className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
          currentView === 'results'
            ? 'bg-blue-500 text-white shadow-md'
            : 'text-blue-600 hover:bg-blue-100'
        }`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
        View Results {hasVoted && '✓'}
      </button>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse text-center">
            <div className="h-12 bg-blue-200 rounded-2xl w-2/3 mx-auto mb-4"></div>
            <div className="h-6 bg-blue-100 rounded-xl w-1/3 mx-auto mb-12"></div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100">
                  <div className="flex gap-6 mb-6">
                    <div className="w-32 h-32 bg-blue-100 rounded-2xl flex-shrink-0"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-blue-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-blue-50 rounded w-full"></div>
                    <div className="h-4 bg-blue-50 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Election Not Found</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!poll) return null;

  const electionStatus = getElectionStatus(poll);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{poll.question}</h1>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${
              electionStatus.status === 'active' ? 'bg-green-500 animate-ping' : 
              electionStatus.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
            }`}></div>
            <p className={`text-lg font-medium ${electionStatus.color}`}>
              {electionStatus.text}
            </p>
          </div>

          {userHasVoted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-green-800 font-semibold">You have already voted in this election</span>
              </div>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <ViewToggle 
          currentView={view} 
          onViewChange={setView}
          isActive={isPollActive(poll)}
          hasVoted={userHasVoted}
        />

        {/* Content */}
        {view === 'results' ? (
          <div className="max-w-4xl mx-auto">
            <PollChart 
              data={poll.options} 
              title={poll.question}
              loading={false}
            />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {poll.options.map((candidate, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-8">
                  
                  {/* TOP SECTION: Image, Name, and Vote Button */}
                  <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    {/* Candidate Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={candidate.imageUrl || 'https://placehold.co/120x120/E2E8F0/4A5568?text=No+Image'}
                        alt={`Photo of ${candidate.name}`}
                        className="w-28 h-28 rounded-2xl object-cover border-4 border-blue-100 shadow-md"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src='https://placehold.co/120x120/E2E8F0/4A5568?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Candidate Name */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-3">
                        <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        {candidate.name}
                      </h3>
                    </div>

                    {/* Vote Button */}
                    {!userHasVoted && isPollActive(poll) && currentUser && (
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleVote(index)}
                          disabled={voting}
                          className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg ${
                            voting 
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white transform hover:-translate-y-0.5 hover:shadow-xl'
                          }`}
                        >
                          {voting ? (
                            <>
                              <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                              </svg>
                              Voting...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Vote
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM SECTION: FULL WIDTH MANIFESTO */}
                  {candidate.description && (
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                        </svg>
                        Manifesto & Key Points
                      </h4>
                      
                      {/* LANDSCAPE GRID LAYOUT */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700">
                        {candidate.description.split('\n').filter(point => point.trim()).map((point, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span className="flex-1">{point.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Candidate Stats (if in results view) */}
                {view === 'results' && (
                  <div className="bg-blue-50 px-8 py-4 border-t border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Vote Count</span>
                      <span className="text-2xl font-bold text-blue-800">{candidate.votes || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* No Vote Access Notice */}
            {!currentUser && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-yellow-800 font-semibold">Login Required</span>
                </div>
                <p className="text-yellow-700">Please log in to vote in this election</p>
              </div>
            )}
          </div>
        )}
        
        {/* Navigation */}
        <div className="text-center mt-12">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-xl transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
            </svg>
            Back to Election Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
