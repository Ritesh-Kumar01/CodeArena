 
  // components/contests/ContestList.tsx
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { FaSpinner } from 'react-icons/fa';
  import {ContestCard, EmptyState} from './EmptyState';
  import { Contest } from './ContestLayout';
  import { Link, useNavigate } from 'react-router-dom';
  
  interface ContestListProps {
    status: 'upcoming' | 'ongoing' | 'completed';
  }
  
  const ContestList: React.FC<ContestListProps> = ({ status }) => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
      fetchContests();
    }, [status]);
  
    const fetchContests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/contests?status=${status}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContests(response.data?.contests || []);
        setError("");
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch contests";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = (contestId: string) => {
      setContests(prevContests => prevContests.filter(contest => contest._id !== contestId));
    };
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      );
    }
  
    return (
      <div className="space-y-4">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        )}
  
        {contests.length > 0 ? (
          contests.map((contest) => (
            <ContestCard
              key={contest._id}
              contest={contest}
              onSelect={(id) => navigate(`/contests/${id}`)}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <EmptyState onCreate={() => navigate("/create-contest")} />
        )}
      </div>
    );
  };
  
  export default ContestList;
  
  