import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/common/DashboardLayout';
import SubmissionsTable from './SubmissionsTable'; 


// Shared table component for submissions
// const SubmissionsTable = ({ submissions }) => {
//   return (
//     <div className="overflow-x-auto rounded-lg border border-gray-700">
//       <table className="min-w-full divide-y divide-gray-700">
//         <thead className="bg-gray-800">
//           <tr>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Problem</th>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Language</th>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Time</th>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Memory</th>
//             <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Submitted At</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-700 bg-gray-900">
//           {submissions.map((submission) => (
//             <tr key={submission._id} className="hover:bg-gray-800">
//               <td className="px-6 py-4 text-sm text-gray-300">{submission.problemId.title}</td>
//               <td className="px-6 py-4 text-sm">
//                 <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
//                   submission.status === 'accepted' ? 'bg-green-800 text-green-100' :
//                   submission.status === 'wrong_answer' ? 'bg-red-800 text-red-100' :
//                   'bg-yellow-800 text-yellow-100'
//                 }`}>
//                   {submission.status.replace('_', ' ')}
//                 </span>
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-300">{submission.language}</td>
//               <td className="px-6 py-4 text-sm text-gray-300">{submission.executionTime}ms</td>
//               <td className="px-6 py-4 text-sm text-gray-300">{submission.memory}KB</td>
//               <td className="px-6 py-4 text-sm text-gray-300">
//                 {new Date(submission.submittedAt).toLocaleString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// All Submissions Page
export const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/submissions/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });        
        setSubmissions(response.data.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <DashboardLayout>
      
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-4">
<div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-100">All Submissions</h1>
      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : (
        <SubmissionsTable initialSubmissions={submissions} />
      )}
    </div>
    </div>
    </div>
      

    </DashboardLayout>
    
  );
};

// My Submissions Page
export const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMySubmissions = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:5000/api/submissions/my-submissions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        console.log(response.data.data);
        
        setSubmissions(response.data.data);
      } catch (error) {
        console.error('Error fetching my submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMySubmissions();
  }, []);

  return (
    <DashboardLayout>

<div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-4">
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-100">My Submissions</h1>
      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : (
        <SubmissionsTable initialSubmissions={submissions} />
      )}
    </div>
    </div>
    </div>

    </DashboardLayout>
  );
};

// Recent Submissions Page
export const RecentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/submissions/recent',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSubmissions(response.data.data);
      } catch (error) {
        console.error('Error fetching recent submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSubmissions();
  }, []);

  return (
    <DashboardLayout>
      
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-4">
<div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-100">Recent Submissions</h1>
      {loading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      ) : (
        <SubmissionsTable initialSubmissions={submissions} />
      )}
    </div>
    </div>
    </div>
    </DashboardLayout>
    
  );
};