/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_VERSION_URL: string
  VITE_APP_TITLE: string
  VITE_I18N_URL: string
  VITE_I18N_UPLOAD_URL: string
  VITE_I18N_APP: string
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}
