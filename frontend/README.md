# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses Oxc
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses SWC

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev and build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Workspace pages

The workspace is available at `/dashboard`, `/tasks`, `/calendar`, `/notes`, and `/projects`. Tasks are loaded from the authenticated backend API; task start and end timestamps drive the calendar and dashboard schedule. The calendar always opens on the current month.

Notes and projects currently persist in browser storage, scoped to the signed-in user. They are not synchronized between devices.

Set `VITE_API_URL` to the backend origin (without the `/api` suffix) when it differs from the configured development API host.
