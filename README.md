# CodeArena 🏆

A real-time competitive coding platform that transforms coding contests into an engaging, interactive experience. CodeArena provides a secure, scalable environment for hosting coding competitions with live evaluation, instant feedback, and real-time leaderboards.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 🌟 Features

- **Real-time Code Execution**: Secure sandbox environment supporting multiple programming languages
- **Live Leaderboard**: Dynamic rankings updated in real-time using WebSocket
- **Interactive IDE**: Feature-rich code editor with syntax highlighting and auto-completion
- **Advanced Analytics**: Performance tracking and submission analytics
- **Plagiarism Detection**: Built-in system to maintain contest integrity
- **Contest Management**: Comprehensive tools for creating and managing coding competitions

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Monaco Editor
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Code Execution**: Docker
- **Authentication**: JWT

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/codearena.git

# Install dependencies for backend
cd backend
npm install

# Install dependencies for frontend
cd ../frontend
npm install

# Set up environment variables
cp .env.example .env

# Start development servers
# Backend
npm run dev:server

# Frontend
npm run dev:client
```

## 🌐 Environment Setup

Required environment variables:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
DOCKER_HOST=your_docker_host
```

## 📖 Documentation

Detailed documentation is available in the `/docs` directory:
- API Documentation
- Setup Guide
- User Manual
- Contributing Guidelines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Roadmap

- AI-powered code suggestions
- Virtual contest rooms
- Mobile app development
- Integration with GitHub/GitLab
- Support for more programming languages

## 📞 Contact

For questions or feedback, please open an issue or contact the maintainers.

---