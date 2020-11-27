import defaultDictionary from '../../i18n/en';

export interface IClient {
  logoUri?: string;
  clientName?: string;
  jwksUri: string;
  applicationType: 'native' | 'web' | 'server-to-server' |
  'single-page-application' | 'financial';
  social: string[];
}

type DictionaryItem = string | Record<string, string>
export interface ILocaleSettings {
  dictionary: Record<string, typeof defaultDictionary | DictionaryItem>;
  defaultLocale: string;
}

export type WidgetModes = 'login' | 'register' | 'recovery' | 'consent'
| 'challenge' | 'sms' | 'email' | 'otp'
| 'signup' | 'resetPassword' | 'fillMissing' | 'verifyEmail'

export type SocialConnections = 'google' | 'facebook' | 'linkedin'



export interface AdditionalFields {
  [key: string]: FieldDefinition;
}

interface CommonFieldProps {
  type: string;
  attrs?: Record<string, string>;
  value?: unknown;
  label?: string;
  order?: number;
  errors?: string | string[] | null;
  validator?(this: { $t: (key: string, ...args: any) => string },fields: {
    [key in keyof AdditionalFields]: FieldDefinition;
  },
    value: any): ()  => string | boolean | Promise<string | boolean>
}
export type FieldDefinition = CommonFieldProps & (
  {
    type: 'password' | 'text' | 'email';
  }
  |
  {
    type: 'code',
    length?: number
  }
)

export interface IWidgetSettings {
  locale: ILocaleSettings;
  mode: WidgetModes;
  modeOptions: Record<WidgetModes, any>,
  footer?: {
    enabled?: boolean
  },
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
