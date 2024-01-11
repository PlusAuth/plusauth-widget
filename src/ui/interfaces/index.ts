import type defaultDictionary from '../../i18n/en';

export interface IClient {
  logoUri?: string;
  clientName?: string;
  jwksUri: string;
  applicationType: 'native' | 'web' | 'server-to-server' |
  'single-page-application' | 'financial';
  social: string[];
}

type DictionaryItem = string | Record<string, any>
export interface ILocaleSettings {
  dictionary: Record<string, typeof defaultDictionary | DictionaryItem>;
  defaultLocale: string;
  selectedLocale?: string;
}

export type WidgetModes = 'login' | 'recovery' | 'consent'
| 'challenge' | 'smsMfa' | 'emailMfa' | 'otpMfa' | 'fvMfa' | 'webauthnMfa' | 'pushMfa'
| 'signup' | 'resetPassword' | 'fillMissing' | 'verifyEmail'
| 'passwordlessEmail' | 'passwordlessSms' | 'passwordlessPush' | 'passwordlessOtp' | 'userProfile'

export type FieldValidator<T extends (string | number)> = (
  this: { $t: (key: string, ...args: any) => string },
  fields: {
    [key in T]: FieldDefinition;
  },
  value: any
)
=> string | boolean | Promise<string | boolean>;


export interface AdditionalFields {
  [key: string]: FieldDefinition;
}

interface CommonFieldProps {
  attrs?: {
    hideMessages?: boolean
    [key: string]: string | boolean | number | undefined
  };
  slots?: Record<string, { element: string, props: Record<string, any> }>,
  visible?: boolean | 'hidden'
  value?: unknown;
  type: string;
  format?: 'tel' | 'email';
  order?: number;
  errors?: string | string[] | ITranslatePath | null ;
  required?: boolean;
  validator?: FieldValidator<keyof AdditionalFields>;
}
export type FieldDefinition = CommonFieldProps & ({
  type: 'password' | 'text' | 'checkbox';
  label?: string;
} | {
  type: 'code',
  length?: number
})

export interface IWidgetSettings {
  apiUrl: string;
  locale: ILocaleSettings;
  modeOptions: Partial<Record<WidgetModes, any>>,
  socialLogin?: {
    buttonVariant?: 'circle' | 'block'
  },
  footer?: {
    enabled?: boolean
  },
  theme: Partial<{
    primary: string;
    secondary: string;
    accent: string;
    error: string;
    info: string;
    success: string;
    warning: string;
  }>
}

export interface ITenantSettings {
  auto_sign_in: boolean,
  forgot_password_enabled: boolean,
  password_policy: {
    min?: (number | null)
    max?: (number | null)
    custom_chars?: (string | null)
    history?: (number | null)
    upper_case?: (number | null)
    lower_case?: (number | null)
    number?: (number | null)
  };
  register_enabled: boolean,
  welcome_emails_enabled: boolean,
  tenant_login_url: boolean
}

export interface IPlusAuthContext {
  client: IClient;
  settings: Partial<ITenantSettings>;
  details: any;
  params: any;
}

export type ITranslatePath = string | {
  path: string,
  args?: Record<string, any> | any[],
  locale?: string
}
