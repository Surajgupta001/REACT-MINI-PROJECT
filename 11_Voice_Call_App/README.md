# React + Vite

> **⚠️ SECURITY WARNING:**
> - Never commit your `.env` file to version control (it is already in `.gitignore`).
> - Only share `.env.example` as a template—never your real secrets.
> - Do not use secrets (like `SERVER_SECRET`) with the `VITE_` prefix; these are exposed to the browser.
> - Always generate sensitive tokens on the server, not in client-side code.

## Environment Variables
- Copy `.env.example` to `.env` and fill in your values.
- Only `VITE_APP_ID` is safe for client-side use. Keep `SERVER_SECRET` on the server.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
