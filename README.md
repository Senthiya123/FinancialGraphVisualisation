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

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
