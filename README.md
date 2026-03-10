# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Non-Functional UI
UI elements that are present but do not affect behaviour or calculations:
| Location | Element | Issue |
|----------|---------|-------|
| Header | Foundations tab | No routing; click does nothing |
| Header | Goals tab | Same as above |
| Header | Log out menu item | No `onClick`; does not log out |
| Superannuation modal | Apply SCG maximum amount checkbox | Value never used in calculations |
| Insurance modal | Apply SCG maximum amount checkbox | Wrong label; value never used |
| All projection modals | SAVE button | Only `console.log`s; no persistence |
| Savings modal | Savings Goal Progress field | Does not affect bar graph |
| Savings modal | Time Horizon field | Graph uses global slider instead |
| Savings modal | New Goal Progress field | Does not affect bar graph |
| Savings modal | New Time Horizon field | Graph uses global slider instead |
| Savings modal | Additional Contributions card | Fields not used by graph |
| Savings summary | Time to goal | Hardcoded goal of $50,000 |
| Dropzone | Current value | Fixed formula; not from user inputs |

## NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| nvm install | `nvm install` | Install Node.js version from `.nvmrc` |
| nvm use | `nvm use` | Use Node version from `.nvmrc` |
| npm install | `npm install` | Install project dependencies |
| npm run dev | `npm run dev` | Start dev server (Vite) |
| npm run build | `npm run build` | `tsc -b && vite build` — Type-check and build |
| npm run lint | `npm run lint` | Run ESLint |
| npm run preview | `npm run preview` | Preview production build |
