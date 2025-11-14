## ShelfNet Frontend Patterns

This workspace now ships with a batteries-included demo that showcases:

- **State management** powered by [Zustand](https://zustand-demo.pmnd.rs/) with cookie-backed session persistence.
- **Authentication & session guards** (mock auth service, session store, `AuthGuard` component, and `middleware.ts`).
- **Typed API layer** with a shared fetch utility, domain models, and example integrations for Weather (Open-Meteo) & GitHub Search APIs.
- **TanStack Query** for declarative data fetching, caching, and background refresh.
- **Zod + React Hook Form** for real-time validation feedback in forms & search bars.
- **Tailwind CSS 4** + a splash of [Framer Motion](https://www.framer.com/motion/) for micro interactions and a gradient hero animation.

Everything is wired inside the `/app/demo` route so newcomers can see clean, scalable patterns without impacting legacy screens.

### Tech Stack

| Area               | Tooling                                                  |
| ------------------ | -------------------------------------------------------- |
| Framework          | Next.js App Router (v16)                                 |
| Styling            | Tailwind CSS 4, CSS variables, Framer Motion             |
| Forms & Validation | React Hook Form, Zod, @hookform/resolvers                |
| Data fetching      | Fetch API helper + TanStack Query + React Query Devtools |
| State/session      | Zustand store + js-cookie persistence                    |
| Utilities          | clsx, lucide-react icons                                 |

### Getting Started

```bash
npm install
npm run dev
```

- Browse `http://localhost:3000/demo` for the interactive playground (auth form, live validation, search experiences).
- Try to open `/demo/protected` without logging in to watch the guard & middleware in action.
- Demo credentials: `mentor@shelfnet.dev / ReadMore!`.
- Widgets included: auth form (React Hook Form + Zod), GitHub search (TanStack Query + debounce), and weather snapshot (typed fetch helper hitting wttr.in).

### Project Layout

```
src/
	components/        # Reusable UI (auth form, search bar, cards, hero animation)
	hooks/             # Custom hooks (auth, debounced value)
	lib/               # apiClient + session helpers
	models/            # Domain models (user, session, weather, github)
	providers/         # React Query provider
	services/          # Auth + Weather + GitHub clients
	store/             # Zustand session store
	utils/             # Fetch helpers, validators
app/demo             # Landing + protected dashboard using the stack above
```

### Extending the Scaffold

1. Duplicate the `/app/demo` route group to bootstrap new features with the same patterns.
2. Add new service modules under `src/services` and export typed functions.
3. Create matching models + validators in `src/models` and `src/utils/validators` to keep contracts explicit.
4. Compose UI by mixing server components for layout + client components for interactions.

This structure keeps the learning curve low for newcomers while staying production-ready for rapid iteration.
