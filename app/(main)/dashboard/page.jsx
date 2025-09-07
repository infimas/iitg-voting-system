'use client';

import { useEffect, useState } from 'react';
import { getPolls } from '@/lib/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

// Clean Status Badge - Blue Theme
const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-blue-500 text-white',
    upcoming: 'bg-blue-100 text-blue-700 border border-blue-200',
    closed: 'bg-gray-100 text-gray-600 border border-gray-200',
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-lg ${styles[status]} transition-colors`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Elegant Progress Bar - Blue Theme
const TimeProgressBar = ({ start, end }) => {
  const now = new Date().getTime();
  const startTime = start.toDate().getTime();
  const endTime = end.toDate().getTime();

  if (now < startTime || now > endTime) return null;

  const totalDuration = endTime - startTime;
  const elapsedTime = now - startTime;
  const progress = (elapsedTime / totalDuration) * 100;
  
  const daysLeft = Math.ceil((endTime - now) / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil((endTime - now) / (1000 * 60 * 60));
  
  let timeLeftText = '';
  let urgencyColor = 'bg-blue-500';
  
  if (daysLeft > 1) {
    timeLeftText = `${daysLeft} days remaining`;
    urgencyColor = 'bg-blue-500';
  } else if (hoursLeft > 1) {
    timeLeftText = `${hoursLeft} hours remaining`;
    urgencyColor = 'bg-blue-600';
  } else {
    timeLeftText = 'Ending soon';
    urgencyColor = 'bg-red-500';
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
      <div className="flex justify-between items-center text-sm text-blue-800 mb-2">
        <span>Progress</span>
        <span className="font-semibold">{timeLeftText}</span>
      </div>
      <div className="w-full bg-blue-100 rounded-full h-2">
        <div 
          className={`${urgencyColor} h-2 rounded-full transition-all duration-700`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-blue-600 mt-2 text-center">
        {Math.round(progress)}% completed
      </div>
    </div>
  );
};

// Simple Loading - Blue Theme
const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-blue-200 rounded w-1/3"></div>
      <div className="h-4 bg-blue-100 rounded w-1/4"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <div className="h-4 bg-blue-100 rounded w-2/3 mb-2"></div>
            <div className="h-8 bg-blue-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Clean Stats Card - Blue Theme
const StatsCard = ({ title, count, description, isActive = false }) => (
  <div className={`p-6 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${
    isActive 
      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
      : 'bg-white border-blue-100 hover:border-blue-200'
  }`}>
    <h3 className={`text-sm font-medium uppercase tracking-wide ${
      isActive ? 'text-blue-100' : 'text-blue-600'
    }`}>
      {title}
    </h3>
    <p className={`text-3xl font-bold mt-2 ${
      isActive ? 'text-white' : 'text-gray-900'
    }`}>
      {count}
    </p>
    <p className={`text-sm mt-1 ${
      isActive ? 'text-blue-100' : 'text-gray-500'
    }`}>
      {description}
    </p>
  </div>
);

export default function DashboardPage() {
  const [allPolls, setAllPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
    });
    
    async function fetchPolls() {
      try {
        const { polls } = await getPolls();
        setAllPolls(polls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
    return () => unsubscribe();
  }, []);

  const now = new Date();
  const activePolls = allPolls.filter(p => p.startTime && p.endTime && p.startTime.toDate() <= now && p.endTime.toDate() >= now);
  const upcomingPolls = allPolls.filter(p => p.startTime && p.startTime.toDate() > now);
  const closedPolls = allPolls.filter(p => p.endTime && p.endTime.toDate() < now);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Clean Header - Blue Theme */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {currentUser?.displayName || 'Student'}
            </h1>
          </div>
          <p className="text-lg text-gray-600 ml-16">
            IITG Election Dashboard • Manage your democratic participation
          </p>
        </div>

        {/* Clean Stats - Blue Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            title="Active Elections"
            count={activePolls.length}
            description="Currently running"
            isActive={activePolls.length > 0}
          />
          <StatsCard
            title="Upcoming Elections"
            count={upcomingPolls.length}
            description="Scheduled ahead"
          />
          <StatsCard
            title="Total Elections"
            count={allPolls.length}
            description="All time"
          />
        </div>

        {/* Active Elections - Blue Theme */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Elections</h2>
            {activePolls.length > 0 && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                {activePolls.length} live
              </span>
            )}
          </div>
          
          {activePolls.length > 0 ? (
            <div className="space-y-6">
              {activePolls.map(poll => (
                <Link key={poll.id} href={`/election/${poll.id}`} className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {poll.question}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Ends on {poll.endTime.toDate().toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <StatusBadge status="active" />
                    </div>
                    <TimeProgressBar start={poll.startTime} end={poll.endTime} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-100 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Elections</h3>
              <p className="text-gray-500">Check back later for new elections</p>
            </div>
          )}
        </section>

        {/* Upcoming Elections - Blue Theme */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Elections</h2>
          
          {upcomingPolls.length > 0 ? (
            <div className="space-y-4">
              {upcomingPolls.map(poll => (
                <div key={poll.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">{poll.question}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Starts {poll.startTime.toDate().toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <StatusBadge status="upcoming" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">No upcoming elections scheduled</p>
            </div>
          )}
        </section>

        {/* Past Elections - Blue Theme */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Past Elections</h2>
            {closedPolls.length > 0 && (
              <span className="text-gray-500 text-sm">{closedPolls.length} completed</span>
            )}
          </div>
          
          {closedPolls.length > 0 ? (
            <div className="space-y-4">
              {closedPolls.slice(0, 5).map(poll => (
                <Link key={poll.id} href={`/election/${poll.id}`} className="block group">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                          {poll.question}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Ended {poll.endTime.toDate().toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
                          View results →
                        </span>
                        <StatusBadge status="closed" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {closedPolls.length > 5 && (
                <div className="text-center pt-4">
                  <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    View {closedPolls.length - 5} more elections →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500">No past elections to display</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
