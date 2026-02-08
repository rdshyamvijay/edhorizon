# Phase 3: Core Navigation & Layout (Workspace Shell)

## 1. Overview
Phase 3 involved building the "Command Center" of EdHorizon. The goal was to create a high-fidelity, responsive navigation experience that adapts dynamically to the user's role and screen size.

## 2. Development Done
- **Dynamic Sidebar**: Built a hover-expandable sidebar with sophisticated CSS transitions.
- **Global Layout**: Implemented a shared dashboard wrapper (`(dashboard)/layout.tsx`) with server-side auth checking.
- **Navigation Filtering**: Created a centralized `NAV_ITEMS` registry mapped to user roles.
- **Mobile Responsiveness**: Designed a separate mobile header for small viewports.

## 3. Technical Details
### Component Architecture
- **Hover Sidebar**: [Sidebar.tsx](file:///Users/sk/Downloads/Autup/EdHorizon/components/shared/Sidebar.tsx) uses a `group` class on the parent container to trigger expansion. It transitions width from `w-20` to `w-64`.
- **Role-Based Menus**: Uses `NAV_ITEMS.filter` to only display links that the current user's role is authorized to see.
- **Visual Feedback**: Active routes are highlighted with a vertical gradient bar (`from-indigo-500 to-violet-500`) and a shadow effect.
### State Management
- **Client-Side Profile Fetch**: The sidebar uses `supabase.auth.getUser()` and a subsequent `profiles` table query to determine the UI state.
- **Next.js `usePathname`**: Used to determine the active navigation state for visual highlighting.

## 4. Implementation Specs
### Sidebar Expansion Logic
1. The sidebar maintains a collapsed state (`w-20/w-24`) to maximize workspace area.
2. `hover:w-64` and `group-hover:opacity-100` enable smooth expansion of labels and brand text.
3. Transition duration is set to `300ms` for a premium feel.

### Workspace Guarding
- [layout.tsx](file:///Users/sk/Downloads/Autup/EdHorizon/app/%28dashboard%29/layout.tsx) performs a server-side redirect if no session is detected, ensuring that even if the client-side UI fails, the route is protected.

## 5. Impact
- **Productivity**: Users can navigate the entire platform with minimal clicks.
- **Cleanliness**: The "Obsidian-style" dark sidebar reduces eye strain and keeps the focus on the content.
- **Consistency**: All dashboard sub-pages share the same navigation and layout logic, reducing development overhead for new features.
