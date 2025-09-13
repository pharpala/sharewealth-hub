# ShareWealth Hub - Social Finance Platform

A comprehensive social finance application built with Next.js, featuring investment tracking, market trends analysis, and financial insights. This project combines the robust Next.js framework with a beautiful Shadcn UI component library to create a modern financial platform.

## ✨ Features

- 📊 **Investment Dashboard** - Track your portfolio performance and investments
- 📈 **Market Trends** - Real-time market analysis and trending insights  
- 🎯 **Financial Planning** - Tools for budgeting and financial goal setting
- 🔍 **Data Visualization** - Interactive charts powered by Recharts
- 🌙 **Dark/Light Mode** - Beautiful theming with next-themes
- 📱 **Responsive Design** - Optimized for all device sizes
- 🚀 **Modern Stack** - Built with Next.js 15, React 19, and TypeScript

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.5.3](https://nextjs.org) with App Router
- **UI Library**: [Shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with animations
- **Charts**: [Recharts](https://recharts.org/) for data visualization  
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **State Management**: [TanStack React Query](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── HeroSection.tsx    # Landing page hero
│   └── Navigation.tsx     # Main navigation
├── pages/                 # Social finance app pages
│   ├── Dashboard.tsx      # Investment dashboard
│   ├── Investments.tsx    # Portfolio management
│   └── Trends.tsx         # Market trends
├── lib/
│   └── utils.ts           # Utility functions
└── hooks/                 # Custom React hooks
```

## 🎨 UI Components

This project includes a comprehensive set of UI components:

- Navigation & Layout components
- Form controls (inputs, selects, checkboxes, etc.)
- Data display (tables, cards, badges)
- Feedback (alerts, toasts, dialogs)
- Interactive components (carousels, accordions, tabs)

## 🔧 Development

- **Turbopack**: Fast development builds with `--turbopack` flag
- **TypeScript**: Full type safety throughout the application  
- **ESLint**: Code quality and consistency
- **Path Aliases**: Clean imports with `@/*` mapping

## 🚀 Deployment

Deploy on [Vercel](https://vercel.com/new) (recommended) or any Node.js hosting platform:

```bash
npm run build
npm run start
```

## 📄 License

Built for Hack the North 2025 🍁