// import React, { useState, useEffect } from 'react';
// import { useParams,Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { 
//   FaCalendarAlt, 
//   FaClock, 
//   FaUsers, 
//   FaLock,
//   FaUnlock,
//   FaSpinner,
//   FaArrowLeft,
//   FaPlay,
//   FaCheckCircle,
//   FaExclamationCircle,

// } from 'react-icons/fa';
// import DashboardLayout from '../../components/common/DashboardLayout';

// const CountdownTimer = ({ targetDate, status }) => {
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0
//   });


//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const difference = new Date(targetDate) - new Date();
      
//       if (difference > 0) {
//         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
//         const minutes = Math.floor((difference / 1000 / 60) % 60);
//         const seconds = Math.floor((difference / 1000) % 60);
        
//         setTimeLeft({ days, hours, minutes, seconds });
//       }
//     };

//     const timer = setInterval(calculateTimeLeft, 1000);
//     calculateTimeLeft();

//     return () => clearInterval(timer);
//   }, [targetDate]);

//   if (status === 'completed') {
//     return (
//       <div className="flex items-center justify-center gap-2 text-gray-400">
//         <FaCheckCircle className="w-5 h-5" />
//         <span>Contest Ended</span>
//       </div>
//     );
//   }

//   if (status === 'ongoing') {
//     return (
//       <div className="flex items-center justify-center gap-2 text-green-500">
//         <FaPlay className="w-5 h-5" />
//         <span>Contest in Progress</span>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-4 gap-4">
//       {Object.entries(timeLeft).map(([unit, value]) => (
//         <div key={unit} className="flex flex-col items-center">
//           <div className="bg-gray-800 rounded-lg p-3 w-20">
//             <div className="text-2xl font-bold text-white text-center">
//               {value.toString().padStart(2, '0')}
//             </div>
//           </div>
//           <div className="text-sm text-gray-400 mt-1 capitalize">{unit}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

// const ContestDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [contest, setContest] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [joining, setJoining] = useState(false);

//   useEffect(() => {
//     const fetchContestDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`http://localhost:5000/api/contests/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

        
//         setContest(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch contest details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContestDetails();
//   }, [id]);

//   const handleJoinContest = async () => {
//     try {
//       setJoining(true);
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/api/contests/${id}/join`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // Refresh contest data
//       const response = await axios.get(`http://localhost:5000/api/contests/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       setContest(response.data);

//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to join contest");
//     } finally {
//       setJoining(false);
//     }
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       timeZoneName: 'short'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <FaSpinner className="w-12 h-12 text-indigo-500 animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 p-6">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
//             <FaExclamationCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             <h2 className="text-xl text-red-500 mb-2">Error Loading Contest</h2>
//             <p className="text-gray-300 mb-4">{error}</p>
//             <button
//               onClick={() => navigate('/contests')}
//               className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//             >
//               Return to Contests
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!contest) return null;

//   const isJoined = contest.participants?.some(
//     participant => participant._id === localStorage.getItem("userId")
//   );




//   return (
//     <DashboardLayout>

// <div className="min-h-screen bg-gray-900">
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//         {/* Header */}
//         <button
//           onClick={() => navigate('/contests')}
//           className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
//         >
//           <FaArrowLeft className="w-4 h-4" />
//           <span>Back to Contests</span>
//         </button>

//         {/* Contest Header */}
//         <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//             <div className="w-[70%]">
//               <h1 className="text-3xl font-bold text-white mb-2">{contest.title}</h1>
//               <p className="text-gray-300">{contest.description}</p>
//             </div>
//             <div className="flex flex-col items-center gap-4">
//               <CountdownTimer targetDate={contest.startTime} status={contest.status} />
//               {!isJoined && contest.status !== 'completed' && (
//                 <button
//                   onClick={handleJoinContest}
//                   disabled={joining || contest.status === 'completed'}
//                   className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
//                     joining 
//                       ? 'bg-gray-600 cursor-wait' 
//                       : 'bg-indigo-600 hover:bg-indigo-700'
//                   } text-white`}
//                 >
//                   {joining ? (
//                     <>
//                       <FaSpinner className="w-4 h-4 animate-spin" />
//                       <span>Joining...</span>
//                     </>
//                   ) : (
//                     <>
//                       {contest.status === 'upcoming' ? <FaLock className="w-4 h-4" /> : <FaUnlock className="w-4 h-4" />}
//                       <span>Join Contest</span>
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Contest Info Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
//             <h2 className="text-xl font-semibold text-white mb-4">Contest Details</h2>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <FaCalendarAlt className="w-5 h-5 text-indigo-500" />
//                 <div>
//                   <p className="text-gray-400 text-sm">Start Time</p>
//                   <p className="text-white">{formatDate(contest.startTime)}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <FaClock className="w-5 h-5 text-indigo-500" />
//                 <div>
//                   <p className="text-gray-400 text-sm">End Time</p>
//                   <p className="text-white">{formatDate(contest.endTime)}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <FaUsers className="w-5 h-5 text-indigo-500" />
//                 <div>
//                   <p className="text-gray-400 text-sm">Participants</p>
//                   <p className="text-white">{contest.participants?.length || 0} Registered</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
//             <h2 className="text-xl font-semibold text-white mb-4">Problems</h2>
//             {contest.status === 'upcoming' ? (
//               <div className="flex flex-col items-center justify-center h-40 text-gray-400">
//                 <FaLock className="w-8 h-8 mb-2" />
//                 <p>Problems will be visible when the contest starts</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {contest.problems?.map((problem, index) => (
//                   <Link
//                     to={`/editor/${problem.toString()}`}
//                     key={problem}
//                     className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer"
//                   >
//                     <span className="text-white">Problem {index + 1}</span>
//                     <span className="text-gray-400">5 points</span>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>


//     </DashboardLayout>
  
//   );
// };

// export default ContestDetail;


// types.ts
export interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: Participant[];
  problems: Problem[];
  createdBy: {
    _id: string;
    name: string;
  };
  rules?: string[];
  prize?: string;
}

export interface Participant {
  _id: string;
  userId: string;
  contestId: string;
  registrationTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Problem {
  _id: string;
  title: string;
  difficulty: string;
}

// components/contests/ContestDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaSpinner,
  FaTrophy,
  FaListUl
} from 'react-icons/fa';
import DashboardLayout from './../../components/common/DashboardLayout';
import RegistrationModal from './RegistrationModal';

const ContestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [userParticipation, setUserParticipation] = useState<Participant | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data._id);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/contests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContest(response.data);
        
        // Check if user is already registered
        if (userId) {
          const participant = response.data.participants.find(
            (p: Participant) => p.userId === userId
          );
          setUserParticipation(participant || null);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch contest details');
      } finally {
        setLoading(false);
      }
    };

    if (id && userId) {
      fetchContestDetails();
    }
  }, [id, userId]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = (startTime: string, endTime: string) => {
    const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getRegistrationButton = () => {
    if (!contest) return null;

    if (userParticipation) {
      const status = userParticipation.status;
      switch (status) {
        case 'pending':
          return (
            <button
              disabled
              className="px-6 py-3 bg-yellow-500/20 text-yellow-500 rounded-lg cursor-not-allowed"
            >
              Registration Pending
            </button>
          );
        case 'approved':
          return (
            <button
              onClick={() => navigate(`/contests/${id}/problems`)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Enter Contest
            </button>
          );
        case 'rejected':
          return (
            <button
              disabled
              className="px-6 py-3 bg-red-500/20 text-red-500 rounded-lg cursor-not-allowed"
            >
              Registration Rejected
            </button>
          );
        default:
          return null;
      }
    }

    if (contest.status === 'upcoming') {
      return (
        <button
          onClick={() => setIsRegistrationOpen(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Register Now
        </button>
      );
    }

    if (contest.status === 'completed') {
      return (
        <button
          disabled
          className="px-6 py-3 bg-gray-600 text-white rounded-lg cursor-not-allowed"
        >
          Contest Ended
        </button>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <FaSpinner className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contest) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
            <p className="text-red-500">{error || 'Contest not found'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">{contest.title}</h1>
                {getRegistrationButton()}
              </div>

              {/* Contest Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <FaCalendarAlt className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-400">Start Time</p>
                    <p>{formatDate(contest.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaClock className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p>{getDuration(contest.startTime, contest.endTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaUsers className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-400">Participants</p>
                    <p>{contest.participants.length} Registered</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
                <p className="text-gray-300">{contest.description}</p>
              </div>

              {/* Rules */}
              {contest.rules && contest.rules.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-white mb-3">
                    <FaListUl />
                    Rules
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {contest.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prize */}
              {contest.prize && (
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-white mb-3">
                    <FaTrophy className="text-yellow-500" />
                    Prize
                  </h2>
                  <p className="text-gray-300">{contest.prize}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        contestId={contest._id}
        onSuccess={(participant) => {
          setUserParticipation(participant);
          setIsRegistrationOpen(false);
        }}
      />
    </DashboardLayout>
  );
};

export default ContestDetail;

export const useParticipation = (contestId: string) => {
const [participation, setParticipation] = useState<Participant | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const checkParticipation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/contests/${contestId}/participation`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setParticipation(response.data);
    } catch (err) {
      setError('Failed to check participation status');
    } finally {
      setLoading(false);
    }
  };

  checkParticipation();
}, [contestId]);

return { participation, loading, error };
};
