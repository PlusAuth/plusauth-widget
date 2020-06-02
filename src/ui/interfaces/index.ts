import { Translator } from '../utils/translator';

export interface IClient {
  logoUri?: string;
  clientName?: string;
  jwksUri: string;
  applicationType: 'native' | 'web' | 'server-to-server' |
  'single-page-application' | 'financial';
  social: string[];
}

export interface ILocaleSettings {
  dictionary: any;
  defaultLocale: string;
}

export type WidgetModes = 'login' | 'register'

export type SocialConnections = 'google' | 'facebook' | 'linkedin'

export type FieldValidator<T extends (string | number)> = (
  this: Translator & { checkPasswordStrength: (...args: any) => any },
  fields: {
    [key in T]: FieldDefinition;
  },
  value: any
)
=> string | boolean | Promise<string | boolean>;


export interface AdditionalFields {
  [key: string]: FieldDefinition;
}

export interface FieldDefinition {
  type?: 'password' | 'text' | 'email';
  value?: unknown;
  label: string;
  validator?: FieldValidator<keyof AdditionalFields>;
  [key: string]: any;
}

export interface IWidgetSettings {
  locale: ILocaleSettings;
  mode: WidgetModes;
  apiUrl: string;
}

export interface ITenantSettings {
  passwordPolicy: any;
  passwordResetFlow: 'code' | 'legacy' | 'newPassword';
}

export interface IPlusAuthContext {
  client: IClient;
  settings: Partial<ITenantSettings>;
  details: any;
  params: any;
}
