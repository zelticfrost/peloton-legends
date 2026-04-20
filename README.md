# Peloton Legends

The ultimate professional road cycling collector's album: discover, collect, and trade cards of the world's greatest riders. Built with **Vite**, **React 19**, **TypeScript**, and **Tailwind CSS**.

## Run locally

**Prerequisites:** [Node.js](https://nodejs.org/) 20+ (CI uses 22).

1. Install dependencies:

   ```bash
   npm install
   ```

2. Optional: copy [`.env.example`](.env.example) to `.env` or `.env.local` if you add Gemini or other env-based features later.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app is configured to listen on port **3000** (see `package.json` `dev` script).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start Vite dev server    |
| `npm run build`| Production build to `dist` |
| `npm run preview` | Preview production build |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

## License

Private project; all rights reserved unless you add a license file.
