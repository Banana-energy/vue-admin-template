/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_VERSION_URL: string
  VITE_APP_TITLE: string
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}
