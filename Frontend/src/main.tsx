import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import './styles/globals.css';
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor/:id" element={<CodeEditor />} />
        <Route path="/edit-problem/:id" element={<EditProblem />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/create-problem" element={<CreateProblem />} />
      </Routes>
    </Router>
  </React.StrictMode>
);