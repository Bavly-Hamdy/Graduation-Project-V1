
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: Record<string, string>;
    };
  }
}

declare module 'react-i18next' {
  export type ReactI18NextChildren = ReactNode;
}
