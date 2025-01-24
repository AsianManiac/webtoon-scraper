# 🚀 Webtoon Downloader Pro

Welcome to the Webtoon Downloader, a powerful application that allows you to download and manage your favorite webtoons with ease! 📚🎨

[![GitHub license](https://img.shields.io/github/license/your-username/webtoon-downloader.svg)](https://github.com/your-username/webtoon-downloader/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/your-username/webtoon-downloader.svg)](https://github.com/your-username/webtoon-downloader/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/your-username/webtoon-downloader.svg)](https://github.com/your-username/webtoon-downloader/issues)
[![GitHub forks](https://img.shields.io/github/forks/your-username/webtoon-downloader.svg)](https://github.com/your-username/webtoon-downloader/network)

<div style="display: flex; flex-direction: 'row'; flex-wrap: wrap; gap: 0.3rem;">
    <img src="./server/screenshots/Screenshot%202025-01-24%20at%2017-24-56%20Vite%20React%20TS.png" width=48%>
    <img src="./server/screenshots/Screenshot%202025-01-24%20at%2017-25-07%20Vite%20React%20TS.png" width=48%>
    <img src="./server/screenshots/Screenshot%202025-01-24%20at%2017-25-23%20Vite%20React%20TS.png" width=48%>
    <img src="./server/screenshots/Screenshot%202025-01-24%20at%2017-27-42%20Vite%20React%20TS.png" width=48%>
    <img src="./server/screenshots/Screenshot%202025-01-24%20at%2017-25-34%20Vite%20React%20TS.png" width=97%>
    <img src="./server/screenshots/Screenshot%202025-01-24%20at%2017-26-16%20Vite%20React%20TS.png" width=48%>
    <img src="./server/screenshots/Screenshot%202025-01-24%20172728.png" width=48%>
</div>

## 📚 Table of Contents

- [🌟 Introduction](#-introduction)
- [✨ Features](#-features)
- [🛠️ Technologies Used](#️-technologies-used)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
    - [Option 1: Neon (Serverless Postgres)](#option-1-neon-serverless-postgres)
    - [Option 2: PostgreSQL with pgAdmin](#option-2-postgresql-with-pgadmin)
    - [Option 3: Supabase](#option-3-supabase)
  - [Environment Variables](#environment-variables)
- [🏃‍♂️ Running the Application](#️-running-the-application)
  - [Server](#server)
  - [Client](#client)
- [🔧 Scripts](#-scripts)
- [📊 Database Schema](#-database-schema)
- [🔄 API Endpoints](#-api-endpoints)
- [🖥️ Client-Side Features](#️-client-side-features)
- [🔒 Security Considerations](#-security-considerations)
- [🚀 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Support](#-support)

## 🌟 Introduction

Welcome to Webtoon Downloader Pro! 🎉 This powerful application allows you to effortlessly download and manage your favorite webtoons. With a robust server that scrapes webtoon data and a sleek React client for an intuitive user experience, you'll never miss a chapter again!

![Application Overview](./assets/app-overview.gif)

## ✨ Features

- 🕷️ Automated webtoon scraping and database seeding
- 📚 Efficient webtoon and chapter downloading
- 🔄 Real-time download progress updates
- 📱 Responsive web client for managing downloads
- 🗃️ PostgreSQL database for reliable data storage
- 🔒 Secure authentication and authorization
- 📊 Detailed download statistics and history

## 🛠️ Technologies Used

- **Backend:**
  - Node.js with Express
  - TypeScript
  - Prisma ORM
  - PostgreSQL
  - WebSocket for real-time updates
- **Frontend:**
  - React with Vite
  - TypeScript
  - Tailwind CSS
  - Framer Motion for animations
- **Tools & Libraries:**
  - Axios for HTTP requests
  - Cheerio for web scraping
  - Bun as the JavaScript runtime

## 🏗️ Architecture

![Architecture Diagram](./assets/architecture-diagram.png)

Our application follows a client-server architecture:

1. The server scrapes webtoon data from various sources.
2. Scraped data is stored in a PostgreSQL database using Prisma ORM.
3. The React client allows users to browse and select webtoons for download.
4. When a download is initiated, the server fetches the webtoon data from the database and begins downloading chapters.
5. Real-time updates are sent to the client using WebSockets.
6. Downloaded webtoons are stored on the server and can be accessed by the client.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- Bun (latest version)
- PostgreSQL (v13 or later)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AsianManiac/webtoon-scraper.git
   cd webtoon-scraper
   ```
2. Install dependencies for both server and client:

   ```shellscript
   # Install server dependencies
   cd server
   bun install

   # Install client dependencies
   cd ../client
   bun install
   ```

3. Set up environment variables:

   ```shellscript
   # In the server directory
   cp .env.example .env
   ```

   Edit the `.env` file with your database credentials and other configurations. We'll cover this in more detail in the [Environment Variables](#environment-variables) section.

### Database Setup

Choose one of the following options to set up your PostgreSQL database:

#### Option 1: Neon (Serverless Postgres)

1. Sign up for a free account at [Neon](https://neon.tech/).
2. Create a new project and database.
3. Copy the connection string provided by Neon.
4. Update your `.env` file with the connection string:

   ```plaintext
   DATABASE_URL=postgres://username:password@your-neon-db-url/database
   ```

#### Option 2: PostgreSQL with pgAdmin

1. Install [PostgreSQL](https://www.postgresql.org/download/) and [pgAdmin](https://www.pgadmin.org/download/) on your local machine.
2. Open pgAdmin and create a new database for the project.
3. Update your `.env` file with the local database credentials:

   ```plaintext
   DATABASE_URL=postgres://username:password@localhost:5432/webtoon_downloader
   ```

#### Option 3: Supabase

1. Sign up for a free account at [Supabase](https://supabase.com/).
2. Create a new project and database.
3. Go to the "Settings" > "Database" section to find your connection string.
4. Update your `.env` file with the Supabase connection string:

   ```plaintext
   DATABASE_URL=postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```plaintext
# Database
DATABASE_URL=your_database_url_here

# Server
PORT=8001

# Webtoon Scraper
WEBTOON_BASE_URL=https://www.webtoons.com
SCRAPE_INTERVAL=3600000 # 1 hour in milliseconds

# Email (for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# File Storage
DOWNLOAD_DIR=./downloads
```

Replace the placeholder values with your actual configuration.

## 🏃‍♂️ Running the Application

### Server

1. Navigate to the server directory:

   ```shellscript
   cd server
   ```

2. Generate prisma interfaces:

   ```shellscript
   npx prisma generate
   ```

3. Run database migrations:

   ```shellscript
   npx prisma migrate dev
   ```

4. Push migrations to database:

   ```shellscript
   npx prisma db push
   ```

5. Start the server:

   ```shellscript
   bun run dev
   ```

The server will start on `http://localhost:8001` (or the port specified in your `.env` file).

### Client

1.  Navigate to the client directory:

    ```shellscript
    cd client
    ```

2.  Start the development server:

    ```shellscript
    npm run dev
    ```

The client will be available at `http://localhost:5173`.

## 🔧 Scripts

Here are the main scripts you can run:

```json
{
  "scripts": {
    "dev": "bun --watch src/web-server.ts",
    "start": "bun run src/server.ts",
    "seed": "bun run src/seeder.ts",
    "scrape": "bun run src/index.ts",
    "build": "bun build src/server.ts --outdir dist --target node"
  }
}
```

- `bun dev`: Start the server in development mode with hot reloading.
- `bun run start`: Start the server in production mode.
- `bun run scrape`: Run the webtoon scraper manually.
- `bun run seed`: Seed the database with initial data.
- `bun run build`: Build the server for production.

## 📊 Database Schema

Here's a simplified version of our database schema:

![Architecture Diagram](./server/screenshots/webtoon-database.png)

## 🔄 API Endpoints

Here are some of the main API endpoints:

- `GET /api/webtoons`: Get a list of all webtoons
- `GET /api/webtoons/:id`: Get details of a specific webtoon
- `POST /api/downloads`: Start a new download
- `GET /api/downloads`: Get all downloads for the current user
- `GET /api/downloads/:id`: Get details of a specific download

For a complete API documentation, please refer to the [API.md](./API.md) file.

## 🖥️ Client-Side Features

Our React client offers a user-friendly interface with the following main features:

1. **Browse Webtoons**: Search and filteravailable webtoons.
2. **Download Management**: Start, pause, andresume downloads.
3. **Real-time Progress**: View download progresswith WebSocket updates.
4. **Library View**: Browse and read downloadedwebtoons.
5. **User Authentication**: Register, log in, and manage your account.

## 🔒 Security Considerations

- We use JWT for authentication and authorization.
- Passwords are hashed using bcrypt before storing in the database.
- API endpoints are protected against unauthorized access.
- Input validation and sanitization are implemented to prevent injection attacks.
- HTTPS is enforced in production to encrypt data in transit.

## 🚀 Deployment

For deployment instructions, please refer to our [Deployment Guide](./DEPLOYMENT.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/your-username/webtoon-downloader/issues) on our GitHub repository.

---

Happy webtoon downloading! 📚🎉
