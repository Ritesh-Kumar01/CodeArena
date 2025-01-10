import React, { useState } from "react";
import QRCode from "react-qr-code";
import Navbar from "../../components/common/Navbar";

const contestsData = [
  {
    id: 1,
    name: "Code Master Challenge",
    desc: "A thrilling coding contest to test your skills.",
    image: "https://via.placeholder.com/150",
    startTime: "2025-01-20 10:00 AM",
    prizes: "$1000",
    qrCode: "https://codearena.com/register/1",
  },
  {
    id: 2,
    name: "Hackathon Blitz",
    desc: "Show your hacking prowess in this 24-hour event.",
    image: "https://via.placeholder.com/150",
    startTime: "2023-01-22 09:00 AM",
    prizes: "$1500",
    qrCode: "https://codearena.com/register/2",
  },
  {
    id: 3,
    name: "Hackathon Blitz",
    desc: "Show your hacking prowess in this 24-hour event.",
    image: "https://via.placeholder.com/150",
    startTime: "2024-01-22 09:00 AM",
    prizes: "$1500",
    qrCode: "https://codearena.com/register/2",
  },
  {
    id: 4,
    name: "Hackathon Blitz",
    desc: "Show your hacking prowess in this 24-hour event.",
    image: "https://via.placeholder.com/150",
    startTime: "2025-01-22 09:00 AM",
    prizes: "$1500",
    qrCode: "https://codearena.com/register/2",
  },
  // More contests...
];

const Contests: React.FC = () => {
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const filteredContests = contestsData.filter((contest) => {
    if (filter === "all") return true;
    const now = new Date();
    const startTime = new Date(contest.startTime);
    return filter === "going" ? startTime >= now : startTime < now;
  });

  return (
    <>
    <Navbar/>
    <div className="py-20 bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950">
        <div className="container mx-auto">

        </div>
    </div>
    <div className="bg-purple-100">
    <div className=" container mx-auto">
      {/* Breadcrumb Section */}
      
    <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-2">Contests</h1>
        <p className="text-sm">Browse ongoing and expired contests. Filter by status and register for your favorite contests.</p>
      </div>

      {/* Filter Navbar */}
      <div className="flex justify-between items-center mb-6">
        <nav className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${filter === "all" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${filter === "going" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => handleFilterChange("going")}
          >
            Ongoing
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${filter === "expired" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => handleFilterChange("expired")}
          >
            Expired
          </button>
        </nav>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700">Create Contest</button>
      </div>

      {/* Contests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContests.map((contest) => (
          <div
            key={contest.id}
            className="border border-gray-300 rounded-lg p-4 shadow-md bg-white flex flex-col justify-between"
          >
            {/* Contest Info */}
            <div className="flex-grow">
              <img src={contest.image} alt={contest.name} className="w-full h-32 object-cover rounded-md mb-4" />
              <h2 className="text-xl font-bold mb-2">{contest.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{contest.desc}</p>
              <p className="text-sm font-semibold mb-2">Start Time: {contest.startTime}</p>
              <p className="text-sm font-semibold">Prizes: {contest.prizes}</p>
            </div>

            {/* QR Code and Register Button */}
            <div className="flex items-center justify-between mt-4">
              <QRCode value={contest.qrCode} size={64} />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700">
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
    
    </>
    
  );
};

export default Contests;