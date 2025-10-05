# Writo - AI-Powered Blog Platform (Frontend)

This is the frontend implementation for the Writo blog platform, built with Next.js 15, Tailwind CSS, and shadcn/ui components. The platform includes AI-powered tools to enhance content creation, personalization, and discovery.

## 🏗️ Project Structure

```
app/
├── (app)/                 # Main application pages (protected by authentication)
│   ├── dashboard/         # User dashboard with stats and blog management
│   ├── blog/              # Blog CRUD operations
│   │   ├── create/        # Create new blog post with AI tools
│   │   ├── [id]/          # Blog detail page
│   │   └── page.tsx       # Blog listing page
│   ├── profile/           # User profile management
│   ├── settings/          # Application settings
│   ├── home/              # Home page with featured content
│   └── layout.tsx         # Main application layout
├── auth/                  # Authentication pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── reset/             # Password reset page
│   ├── new-password/      # Set new password page
│   └── layout.tsx         # Authentication layout
├── layout.tsx             # Root layout
└── page.tsx               # Landing page

components/
├── ai-tools.tsx           # Reusable AI tools component
├── advanced-theme-toggle.tsx
├── modern-layout.tsx      # Main application layout component
├── theme-provider.tsx
├── theme-toggle.tsx
└── auth/                  # Authentication components
    ├── user-button.tsx
    └── ...

lib/                       # Utility functions
hooks/                     # Custom React hooks
```

## 🚀 Key Features Implemented

### 1. Authentication
- Email/password login with Credentials provider
- OAuth login (Google/GitHub)
- Role-based access control (ADMIN, USER)
- Password reset flow

### 2. User Management
- Profile page with authored blogs
- Dashboard showing user's posts and stats
- Account settings and preferences

### 3. Blog Management (CRUD)
- Create blog posts with AI writing assistant
- Read blog feed with personalized recommendations
- Update/Delete functionality (author or admin only)

### 4. Categories & Tags
- One category per blog post
- Multiple tags per blog post
- AI-powered tag suggestions

### 5. AI Integration 🚀
- **AI Writing Assistant**: Suggest headlines, fix grammar
- **AI Summarizer**: Auto-generate blog summary (TL;DR)
- **AI SEO Optimizer**: Suggest keywords & meta description
- **AI Recommendations**: Suggest related blogs based on reading history

## 🎨 Frontend UX + AI Touch

### Create Blog Page
- Title + content editor with AI "Suggest Headline" + "Fix Grammar" buttons
- Sidebar with "Suggested Tags" from AI
- "Generate Summary" button for TL;DR

### Blog Detail Page
- Blog content with AI auto-generated summary at the top
- "Read Related Blogs" with AI recommendations
- Social interactions (likes, comments, shares)

### Dashboard Page
- List of authored blogs with filtering
- Blog performance stats (views, engagement)
- AI insights (SEO suggestions, related tags)

### Responsive Design
- Mobile-first approach
- Clean typography and card-based layout
- Dark/light mode support

## 🛠️ Technologies Used

- **Next.js 15** with App Router
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** icons
- **NextAuth.js** for authentication
- **TypeScript** for type safety

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Component Architecture

### Layout Components
- `ModernLayout` - Main application layout with sidebar navigation
- `ThemeProvider` - Dark/light mode support

### Page Components
- `DashboardPage` - User dashboard with stats and blog management
- `CreateBlogPage` - Blog creation with AI tools
- `BlogDetailPage` - Blog post viewing with AI features
- `ProfilePage` - User profile management
- `HomePage` - Public home page with featured content

### Reusable Components
- `AITools` - AI-powered writing assistance tools
- `AdvancedThemeToggle` - Theme switching with multiple options
- Authentication components for login/register flows

## 🔐 Authentication Flow

1. User visits login page
2. Can login with email/password or OAuth providers
3. Role-based access control determines available features
4. Protected routes redirect unauthenticated users to login
5. Session management with NextAuth.js

## 🎯 AI Features Implementation

### Writing Assistant
- Headline suggestions based on content
- Grammar and spelling corrections
- Content summarization

### SEO Optimization
- Keyword analysis
- Readability scoring
- Content length recommendations

### Personalization
- Tag suggestions based on content
- Related blog recommendations
- Content performance insights

## 📱 Responsive Design

The frontend is fully responsive and works on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)

Features include:
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly controls
- Adaptive typography

## 🎨 UI/UX Features

- Clean, modern design with ample whitespace
- Consistent color scheme and typography
- Intuitive navigation and user flows
- Loading states and feedback
- Accessible components (ARIA labels, keyboard navigation)
- Dark/light mode support

## 📈 Performance Optimizations

- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- Bundle size optimization
- Caching strategies
- Lazy loading for non-critical components

## 🧪 Testing Strategy

- Component unit tests with Jest
- Integration tests for critical user flows
- End-to-end tests with Cypress
- Accessibility testing
- Performance testing

## 🚀 Deployment

- Optimized for Vercel deployment
- Environment variable configuration
- CI/CD pipeline setup
- Monitoring and error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## 📄 License

This project is licensed under the MIT License.