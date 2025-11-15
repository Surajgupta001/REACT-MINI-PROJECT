# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Image Generation (Added)

- Set `OPENAI_API_KEY` in `.env` to enable image generation via `gpt-image-1`.
- In the chat UI, type a prompt and click the image button to generate an image.
- Server endpoint: `POST /api/generate-image` with JSON `{ prompt, size? }`.

Quick start:

```bash
OPENAI_API_KEY=your_openai_api_key_here
npm install
npm run dev:full
```
