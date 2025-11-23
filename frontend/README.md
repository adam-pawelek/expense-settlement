# Expense Settlement Frontend

Next.js frontend application for the Expense Settlement system, built with TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- ✅ User authentication (signup, login)
- ✅ User profile management
- ✅ Group management (create, view, add members)
- ✅ Expense management (create, view history)
- ✅ Balance summary (who owes what)
- ✅ Protected routes
- ✅ Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── profile/           # User profile page
│   ├── groups/            # Groups pages
│   │   ├── page.tsx       # Groups list
│   │   └── [id]/          # Group detail page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── navbar.tsx         # Navigation bar
│   └── protected-route.tsx # Route protection
├── contexts/              # React contexts
│   └── auth-context.tsx   # Authentication context
└── lib/                   # Utilities
    └── api-client.ts      # API client setup
```

## Usage

### Authentication

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Login at `/login`
3. **Profile**: Update your profile at `/profile`

### Groups

1. **View Groups**: See all your groups at `/groups`
2. **Create Group**: Click "Create Group" button
3. **View Group Details**: Click on any group card
4. **Add Members**: Use "Add Member" button in group details

### Expenses

1. **Add Expense**: Click "Add Expense" in group details
2. **View Expenses**: See expense history in the "Expenses" tab
3. **View Balance**: Check who owes what in the "Balance Summary" tab

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **@expense-settlement/client** - API client library

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## Notes

- The client library is linked locally from `../client-library`
- Authentication tokens are stored in localStorage
- Protected routes automatically redirect to login if not authenticated
