# FounderCRM - Modern Task Management & CRM

A beautiful, modern CRM and task management web application built specifically for founders and startups. Features a colorful, minimal design inspired by Notion, Linear, and Pipedrive.

## 🎨 Design Features

- **Modern & Colorful**: Pastel gradients, soft shadows, rounded corners
- **Responsive Design**: Works perfectly on desktop and mobile
- **Interactive UI**: Hover effects, animations, drag-and-drop
- **Clean Navigation**: Icon-based sidebar with quick actions
- **Professional**: Startup-focused design language

## 🚀 Key Features

### Authentication & Workspace
- ✅ Beautiful login/signup pages with gradient backgrounds
- ✅ Workspace creation with team invitations
- ✅ User profile management

### Dashboard
- ✅ Today's Tasks widget with progress tracking
- ✅ Upcoming Deadlines timeline
- ✅ Recent Contact Interactions feed
- ✅ Pipeline Overview with drag-drop visualization
- ✅ Quick Add buttons for common actions
- ✅ Real-time stats cards

### Contacts CRM
- ✅ Card and table view modes
- ✅ Advanced filtering by type, status, and tags
- ✅ Contact types: Customer, Lead, Partner, Investor
- ✅ Status tracking: Active, Hot, Warm, Cold, Churned
- ✅ Deal value tracking
- ✅ Contact interaction history
- ✅ Search and sort functionality

### Task Management
- 🚧 Kanban-style task board (placeholder)
- 🚧 Drag-and-drop functionality
- 🚧 Task priorities and categories
- 🚧 Task-to-contact linking

### Pipeline & Deals
- 🚧 Drag-and-drop deal pipeline (placeholder)
- 🚧 Deal stages: Lead → Qualified → Demo → Proposal → Closed
- 🚧 Deal value tracking
- 🚧 Pipeline analytics

### Reports & Analytics
- 🚧 Analytics dashboard (placeholder)
- 🚧 Task completion rates
- 🚧 Deal conversion metrics
- 🚧 AI suggestions widget

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Drag & Drop**: React Beautiful DnD (planned)
- **Charts**: Recharts (planned)
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd FonderCRM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Quick Start

1. **Login/Signup**: Use any email/password to create an account
2. **Create Workspace**: Set up your startup workspace
3. **Explore Dashboard**: See the overview of tasks, pipeline, and contacts
4. **Manage Contacts**: Add customers, leads, partners, and investors
5. **Track Tasks**: Monitor your daily progress and deadlines

## 📱 UI Components

### Authentication Pages
- **Login**: Gradient background with glassmorphism card
- **Signup**: Multi-step form with validation
- **Workspace Creation**: Company setup and team invitations

### Dashboard Widgets
- **Stats Cards**: Animated cards with gradients and icons
- **Today's Tasks**: Interactive checklist with progress bar
- **Pipeline Overview**: Funnel visualization with deal tracking
- **Recent Interactions**: Activity feed with contact avatars
- **Quick Actions**: Colorful action buttons for common tasks

### Contacts System
- **Contact Cards**: Beautiful cards with avatars and tags
- **Contact Table**: Sortable table with inline actions
- **Advanced Filters**: Filter by type, status, tags
- **Search**: Real-time search across all contact fields

### Layout Components
- **Sidebar**: Icon-based navigation with gradients
- **Navbar**: Search, notifications, profile dropdown
- **Mobile**: Responsive sidebar with smooth animations

## 🎨 Design System

### Colors
- **Primary**: Blue to Purple gradients (#0ea5e9 → #d946ef)
- **Secondary**: Emerald to Teal (#22c55e → #14b8a6)
- **Status Colors**: 
  - Success: Green
  - Warning: Yellow/Orange
  - Error: Red
  - Info: Blue

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable hierarchy

### Components
- **Cards**: White with subtle shadows and borders
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Rounded with focus states
- **Badges**: Colored backgrounds matching content type

## 🔧 Development

### File Structure
```
src/
├── components/
│   ├── layout/          # Navbar, Sidebar, AppLayout
│   ├── dashboard/       # Dashboard widgets
│   ├── contacts/        # Contact management
│   └── ...
├── pages/               # Main route components
├── context/             # React context (Auth)
├── utils/               # Helper functions
└── index.css           # Global styles and Tailwind
```

### Adding New Features
1. Create component in appropriate folder
2. Add route in `App.jsx`
3. Update navigation in `Sidebar.jsx`
4. Follow existing design patterns

### Styling Guidelines
- Use Tailwind utility classes
- Follow the established color palette
- Add hover states and animations
- Ensure mobile responsiveness

## 🚧 Planned Features

### Task Management
- Kanban board with drag-and-drop
- Task categories and filters
- Task dependencies and subtasks
- Time tracking and estimates

### Pipeline Management
- Visual pipeline editor
- Deal probability scoring
- Revenue forecasting
- Pipeline stage automation

### Reports & Analytics
- Interactive charts and graphs
- Custom report builder
- Export functionality
- AI-powered insights

### Integrations
- Email synchronization
- Calendar integration
- Third-party CRM imports
- API webhook support

## 🎉 Getting Started Tips

1. **Mock Data**: The app uses realistic mock data for demonstration
2. **Responsive**: Test on different screen sizes
3. **Animations**: Notice the subtle animations throughout the UI
4. **Interactions**: Click around to see hover effects and transitions
5. **Customization**: Easy to customize colors and styling

## 📄 License

This project is created as a demonstration of modern React/Tailwind development practices.

## 🤝 Contributing

Feel free to enhance the existing features or add new ones:
- Implement the placeholder components
- Add more interactive features
- Improve animations and transitions
- Enhance mobile experience

---

**Enjoy building with FounderCRM!** 🚀✨