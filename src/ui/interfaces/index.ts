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
  errors?: string | string[] | null
  [key: string]: any;
}

export interface IWidgetSettings {
  locale: ILocaleSettings;
  mode: WidgetModes;
  apiUrl: string;
  theme: {
    primary?: string;
    secondary?: string;
    accent?: string;
    error?: string;
    info?: string;
    success?: string;
    warning?: string;
  }
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
