// Vite env types: avoid referencing vite/client so tsc -b does not require resolving it.
// Augment ImportMeta so import.meta.env is typed (e.g. VITE_API_URL).
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  [key: string]: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Minimal asset declarations so tsc accepts imports (e.g. ./index.css).
declare module '*.css' {}
