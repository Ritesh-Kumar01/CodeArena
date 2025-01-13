import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/globals.css';
import Dashboard from './pages/Dashboard/Dashboard';

import LandingPage from './components/LandingPage/LandingPage';
import Signup from './pages/Signup/Signup';
import Signin from './pages/Signin/Signin';
import Contests from './pages/Contests/Contests';
import CodeEditor from './pages/CodeEditor/CodeEditor';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import Problems from './pages/Problems/Problems';
import CreateProblem from './pages/Problems/CreateProblem';
import EditProblem from './pages/Problems/EditProblem';
import AdminDashboard from './pages/Admin/Dashboard';
import UserForm from './pages/Admin/Users/userform';
import Alluser from './pages/Admin/Users/AllUser';
import CreateContest from './pages/Contests/CreateContest';
import ContestDetail from './pages/Contests/ContestDetail';
import EditContestDetail from './pages/Contests/EditContestDetail';
import { AllSubmissions, MySubmissions, RecentSubmissions } from './pages/Submission/AllSubmissions';
import ContestParticipation from './pages/Participants/ContestParticipation';
import UpcomingContests from './pages/Contests/contests/UpcomingContests';
import OngoingContests from './pages/Contests/contests/OngoingContests';
import PastContests from './pages/Contests/contests/PastContests';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/contests/my-registrations" element={<ContestParticipation />} />

        <Route path="/contests/upcoming" element={<UpcomingContests />} />
        <Route path="/contests/ongoing" element={<OngoingContests />} />
        <Route path="/contests/past" element={<PastContests />} />

        <Route path="/contests" element={<Contests />} />
        <Route path="/contests/:id" element={<ContestDetail />} />
        <Route path="/contests/edit/:id" element={<EditContestDetail />} />
        {/* <Route path="/contests/delete/:id" element={<DeleteContestDetail />} /> */}
        <Route path="/create-contest" element={<CreateContest />} />

        <Route path="/submissions/all" element={<AllSubmissions />} />
        <Route path="/submissions/my-submissions" element={<MySubmissions />} />
        <Route path="/submissions/recent" element={<RecentSubmissions />} />


        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor/:id" element={<CodeEditor />} />
        <Route path="/edit-problem/:id" element={<EditProblem />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/create-problem" element={<CreateProblem />} />

        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/create-user" element={<UserForm/>} />
        <Route path="/all-user" element={<Alluser/>} />




      </Routes>
    </Router>
  </React.StrictMode>
);