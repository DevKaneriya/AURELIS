# AURELIS Project - Detailed Statistics

## 📊 Project Overview
**Project Name:** AURELIS  
**Type:** 3D Interactive Web Experience  
**Version:** 0.1.0  
**Architecture:** Frontend Only (React + Three.js)  

---

## 📁 Project Structure

### Root Directory
```
AURELIS/
├── .git/              # Git repository
├── .gitignore         # Git ignore rules
├── frontend/          # React application
└── README.md          # Documentation
```

### Frontend Structure
```
frontend/
├── public/            # Static assets
│   ├── index.html
│   └── models/        # 3D models (ferrari.glb)
├── src/               # Source code
│   ├── components/    # React components
│   ├── constants/     # Constants & test IDs
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries
│   ├── App.js         # Main app component
│   ├── App.css        # App styles
│   ├── index.js       # Entry point
│   ├── index.css      # Global styles
│   └── store.js       # State management
├── plugins/           # Custom webpack plugins
├── node_modules/      # Dependencies
└── config files       # Build & tool configs
```

---

## 📈 Code Statistics

### File Counts
| Category | Count |
|----------|-------|
| **Total Files (entire project)** | 65,553 |
| **Source Files (src/)** | 81 |
| **JavaScript (.js)** | 13 |
| **JSX (.jsx)** | 66 |
| **CSS (.css)** | 2 |
| **Component Files** | 66 |
| **UI Components** | 46 |
| **Chapter Components** | 7 |
| **WebGL Components** | 6 |
| **Library Files** | 6 |
| **Custom Hooks** | 1 |

### Lines of Code
| Language | Lines |
|----------|-------|
| **JavaScript (.js)** | 540 |
| **JSX (.jsx)** | 4,790 |
| **CSS (.css)** | 135 |
| **Total Code Lines** | 5,465 |

### Project Size
| Metric | Size |
|--------|------|
| **Source Code (src/)** | 213 KB (0.21 MB) |
| **Entire Project** | 637.59 MB (0.62 GB) |
| **node_modules/** | ~637 MB |

---

## 📦 Dependencies

### Core Technologies
- **React:** 19.0.0 (Latest)
- **React DOM:** 19.0.0
- **Three.js:** 0.185.1 (3D Graphics)
- **React Three Fiber:** 9.7.0 (React renderer for Three.js)
- **React Three Drei:** 10.7.8 (Three.js helpers)
- **React Three Postprocessing:** 3.0.5 (Visual effects)

### Animation & Scrolling
- **GSAP:** 3.15.0 (Animation library)
- **Framer Motion:** 11.18.0 (React animation)
- **Lenis:** 1.3.26 (Smooth scrolling)

### UI Libraries
- **Radix UI:** 27 components (Accordion, Dialog, Dropdown, etc.)
- **Lucide React:** 0.516.0 (Icons)
- **Tailwind CSS:** 3.4.17 (Styling)
- **Tailwind Merge:** 3.2.0
- **Class Variance Authority:** 0.7.1

### Form & State Management
- **React Hook Form:** 7.56.2
- **Zod:** 3.24.4 (Schema validation)
- **TanStack React Query:** 5.56.2
- **SWR:** 2.3.8

### Routing & Navigation
- **React Router DOM:** 7.15.0

### Utilities
- **Lodash:** 4.18.1
- **Date-fns:** 4.1.0
- **Day.js:** 1.11.13
- **Axios:** 1.18.0 (HTTP client, not used)

### Build Tools & Dev Dependencies
- **CRACO:** 7.1.0 (Custom React App Config)
- **React Scripts:** 5.0.1 (CRA)
- **ESLint:** 9.23.0
- **PostCSS:** 8.5.10
- **Autoprefixer:** 10.4.20
- **TypeScript Types:** @types/lodash
- **Babel Plugins:** Various

### Total Dependencies
- **Production Dependencies:** 59
- **Dev Dependencies:** 12
- **Resolutions (Security Fixes):** 35+

---

## 🎨 Component Breakdown

### Main Components (7)
1. **Experience.jsx** - Main orchestrator
2. **ScrollNarrative.jsx** - Scroll-driven narrative
3. **Chapters.jsx** - Chapter navigation
4. **Loader.jsx** - Loading screen
5. **Cursor.jsx** - Custom cursor
6. **Hud.jsx** - Heads-up display
7. **Menu.jsx** - Navigation menu

### Chapter Components (7)
1. **Configurator.jsx** - Car configurator
2. **Design.jsx** - Design showcase
3. **Finale.jsx** - Ending sequence
4. **Gallery.jsx** - Image gallery
5. **Machine.jsx** - Machine details
6. **Material.jsx** - Material showcase
7. **Performance.jsx** - Performance stats

### WebGL Components (6)
- 3D rendering and scene management
- Camera controls
- Lighting
- Model loading
- Post-processing effects

### UI Components (46)
Complete shadcn/ui component library:
- Accordion, Alert, Avatar, Badge, Breadcrumb
- Button, Calendar, Card, Carousel, Checkbox
- Collapsible, Command, Context Menu, Dialog, Drawer
- Dropdown Menu, Form, Hover Card, Input, Label
- Menubar, Navigation Menu, Pagination, Popover
- Progress, Radio Group, Resizable, Scroll Area
- Select, Separator, Sheet, Skeleton, Slider
- Sonner (Toast), Switch, Table, Tabs, Textarea
- Toast, Toggle, Toggle Group, Tooltip
- And more...

### Utility Libraries (6)
1. **assets.js** - Asset management
2. **audio.js** - Sound effects
3. **device.js** - Device detection
4. **scrollController.js** - Scroll management
5. **scrollState.js** - Scroll state
6. **utils.js** - Helper functions

### Custom Hooks (1)
- **use-toast.js** - Toast notifications

---

## 🛠️ Build Configuration

### Package Manager
- **Yarn:** 1.22.22

### Available Scripts
```bash
npm start   # Development server (uses CRACO)
npm build   # Production build
npm test    # Run tests
```

### Build Tools
- **CRACO** (Create React App Configuration Override)
- **Webpack** (via React Scripts)
- **Babel** (JavaScript transpilation)
- **PostCSS** (CSS processing)
- **Tailwind CSS** (Utility-first CSS)

### Browser Support
**Production:**
- \>0.2% market share
- Not dead browsers
- Not Opera Mini

**Development:**
- Latest Chrome
- Latest Firefox
- Latest Safari

---

## 🎯 Project Features

### Core Functionality
✅ **3D Interactive Experience** - WebGL-powered car showcase  
✅ **Scroll-Driven Narrative** - Story unfolds with scroll  
✅ **Smooth Animations** - GSAP & Framer Motion  
✅ **Custom Cursor** - Enhanced user interaction  
✅ **Responsive Design** - Works on all devices  
✅ **Performance Optimized** - Post-processing effects  
✅ **Chapter Navigation** - Multi-section experience  
✅ **Audio Integration** - Sound effects & ambiance  
✅ **Loading Screen** - Asset preloading  
✅ **Car Configurator** - Customization options  

### Technical Highlights
- **Modern React (v19)** - Latest features
- **Three.js Integration** - Professional 3D rendering
- **Smooth Scrolling** - Lenis implementation
- **Animation Timeline** - GSAP ScrollTrigger
- **Component Library** - Complete UI system
- **State Management** - Zustand store
- **Form Handling** - React Hook Form + Zod
- **Code Splitting** - Optimized loading
- **TypeScript Types** - Enhanced IntelliSense

---

## 📊 Performance Metrics

### Bundle Size Estimate
- **Source Code:** ~213 KB
- **Dependencies:** ~637 MB (development)
- **Production Build:** ~2-5 MB (estimated, after minification & tree-shaking)

### Optimization
- Code splitting enabled
- Lazy loading ready
- Post-processing for visual effects
- Asset optimization
- Tree shaking
- Minification

---

## 🎨 Design System

### Styling
- **Tailwind CSS** - Utility-first framework
- **Custom CSS** - 135 lines of custom styles
- **CSS Variables** - Theme customization
- **Responsive Classes** - Mobile-first approach

### Typography
- Font Display (custom)
- Font Editorial (custom)
- Font Mono (system)

### Color Palette
- Primary: `#ff4400` (Orange/Red)
- Accent: `#00f3ff` (Cyan)
- Background: Dark theme
- Text: White/Gray scale

---

## 🚀 Development Environment

### Current Status
✅ **Running on:** http://localhost:3001  
✅ **Compiled successfully**  
✅ **Hot reload enabled**  
✅ **Development mode active**  

### System Requirements
- **Node.js:** 14+ (recommended 16+)
- **Package Manager:** npm or yarn
- **RAM:** 4GB minimum (8GB recommended)
- **Browser:** Modern browser with WebGL 2.0 support

---

## 📝 Project Type Classification

**Category:** Interactive 3D Web Experience  
**Industry:** Automotive / Luxury Brand Showcase  
**Purpose:** Product Visualization & Brand Storytelling  
**Audience:** Premium automotive enthusiasts  
**Experience Level:** Professional/Commercial grade  

---

## 🎯 Key Selling Points

1. **Premium 3D Visualization** - Professional car showcase
2. **Cinematic Storytelling** - Narrative-driven experience
3. **Smooth Performance** - Optimized rendering
4. **Modern Stack** - Latest React & Three.js
5. **Complete UI System** - 46 pre-built components
6. **Responsive Design** - Works everywhere
7. **Sound Design** - Audio feedback
8. **Easy Customization** - Well-structured code

---

## 📋 Summary

This is a **production-ready, premium 3D interactive web experience** showcasing the AURELIS concept car. The project features:

- **5,465 lines** of well-structured code
- **81 source files** organized in clear directories
- **59 production dependencies** for rich functionality
- **46 reusable UI components** for consistency
- **7 narrative chapters** for storytelling
- **6 WebGL components** for 3D rendering
- **Professional animations** using GSAP & Framer Motion
- **Modern React architecture** with hooks & state management

The codebase is clean, modular, and follows React best practices with a strong focus on user experience, performance, and visual excellence.

---

*Generated on: August 17, 2026*  
*Project: AURELIS v0.1.0*  
*Type: Frontend-Only 3D Web Application*
