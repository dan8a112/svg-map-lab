# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Project Setup

- **Expo version**: ~56.0.9 (pinned, do not upgrade without testing)
- **React Native**: 0.85.3
- **TypeScript**: strict mode enabled
- **Main entry**: `App.tsx` (exports default App component)
- **Metro bundler**: configured in `metro.config.js` with TypeScript support (`ts`, `tsx` extensions)

## Development Commands

```bash
npm start       # Start dev server (choose platform interactively)
npm run android # Android emulator
npm run ios     # iOS simulator
npm run web     # Web preview
```

## TypeScript & Paths

- **Base URL**: `.` (project root)
- **Path alias**: `@/*` → `src/*` (use for cleaner imports)
- **tsconfig**: extends `expo/tsconfig.base`, strict mode
- **Note**: no `src/` directory exists yet—create it when needed and use the alias

## Expo-Specific Quirks

- **Asset loading**: icons and images via `app.json` → only `./assets/` paths are pre-configured
- **Naming**: component filenames should match exports (e.g., `App.tsx` exports `App`)
- **Metro config**: already extends Expo defaults; don't strip required resolvers
- **Build output**: `node_modules/.expo/` is generated; never commit

## React Native Coding

The repo has `vercel-react-native-skills` installed. When building components, animations, or optimizing lists:
- Load the skill with the skill tool if tackling React Native–specific tasks
- Remember: no web-specific APIs (window, document, localStorage)—use React Native APIs only
- StyleSheet performance: use `StyleSheet.create()` for optimization

## No Testing Infrastructure Yet

- No jest, test runners, or test files configured
- If adding tests, coordinate setup with app requirements

## Git & Commit Conventions

- Agrupar cambios relacionados en commits separados
- Usar prefijos convencionales: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.
- La descripción del commit debe ir en español
- Antes de commitear, revisar `git status`, `git diff` y `git log --oneline -5`
- No commitear secrets ni `node_modules/`

## Git & History

- Three commits total; main work is SVG map implementation
- No CI/CD configured yet
