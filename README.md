# Sunday Sprint Quiz

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

A high-performance, secure quiz web application built with React and Vite. It leverages Supabase as its backend database and is designed to be hosted on Netlify. The application includes advanced security and anti-cheat mechanisms to ensure fair participation.

## Key Features

### Advanced Anti-Cheat Security
- **VPN & Timezone Change Detection**: Automatically detects and prevents users from manipulating their geographic location or system time to bypass geographical or time-based quiz constraints.
- **Anti-Refresh Guard**: Prevents users from resetting their quiz state or timer by simply refreshing the browser window. State is strictly managed to enforce continuous attempts.
- **Multi-Participation Guard**: Strictly limits participation to a single attempt per user, utilizing database-level constraints and session verification.

## Tech Stack

- **Frontend**: React 18, Vite
- **Backend & Database**: Supabase (PostgreSQL)
- **Data Export**: XLSX (for spreadsheet generation/parsing)
- **Hosting Target**: Netlify

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Supabase project with your database schema configured

### Installation

1. Clone the repository and navigate into the directory:
   ```bash
   cd quiz-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

To create an optimized production build:

```bash
npm run build
```

You can preview the built application locally using:

```bash
npm run preview
```