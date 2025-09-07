'use client';

import { useEffect, useState } from 'react';
import { getPollRequests } from '@/lib/firestore'; // The function we just made

export default function ViewRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      const { requests: fetchedRequests } = await getPollRequests();
      setRequests(fetchedRequests);
      setLoading(false);
    }
    fetchRequests();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading requests...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Poll Requests</h1>
      {requests.length === 0 ? (
        <p>No new poll requests.</p>
      ) : (
        <div className="space-y-6">
          {requests.map(req => (
            <div key={req.id} className="bg-white p-6 rounded-lg shadow-md border">
              <h2 className="text-xl font-bold">{req.electionTitle}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Requested by: {req.requesterName} ({req.requesterEmail})
              </p>
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold">Candidate Details:</h3>
                <p><strong>Name:</strong> {req.candidateDetails.name}</p>
                <p><strong>Manifesto:</strong></p>
                <p className="whitespace-pre-wrap pl-4 text-gray-700">{req.candidateDetails.description}</p>
                <p><strong>Image URL:</strong> <a href={req.candidateDetails.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 break-all">{req.candidateDetails.imageUrl}</a></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}