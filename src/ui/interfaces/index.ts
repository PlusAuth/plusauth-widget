import type defaultDictionary from '../../i18n/en';
import type { PAlertProps } from '../components/PAlert/PAlert';
import type { createForm } from '../composables/form';

export interface IClient {
  logoUri?: string;
  policyUri?: string;
  tosUri?: string;
  clientName?: string;
  jwksUri: string;
  applicationType: 'native' | 'web' | 'server-to-server' |
  'single-page-application' | 'financial';
  social: string[] | {
    name: string,
    provider: string,
    branding: {
      show_in_login?: boolean
      logo_url?: string
      display_name?: string
    }
  } [];
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
| 'accountLinking'

export type FieldValidator<T extends (string | number)> = (
  this: { $t: (key: string, ...args: any[]) => string },
  fields: {
    [key in T]: FieldDefinition;
  },
  value: any
)
=> string | boolean | Promise<string | boolean>;


export interface AdditionalFields {
  [key: string]: FieldDefinition | null | undefined;
}

export type FieldDefinition =  {
  /**
   * HTML attributes to be set to input element.
   */
  attrs?: {
    hideMessages?: boolean
    [key: string]: string | boolean | number | undefined | null
  };
  slots?: Record<string, { element: string, props: Record<string, any> }>,
  /**
   * If set `true` or string `hidden` the field will not be visible.
   * This could be used for sending static or generic values.
   */
  visible?: boolean | 'hidden'
  /**
   * Value of the field. This property is used for accessing the value or updating it.
   */
  value?: unknown;
  type: 'password' | 'text' | 'checkbox' | 'code' | string;
  length?: number
  /**
   * Label of the field
   */
  label?: string,
  format?: 'tel' | 'email' | string | undefined ;
  /**
   * Only applies for text field
   */
  placeholder?: string
  /**
   * This property can be used to arrange ordering the display of form elements.
   */
  order?: number;

  /**
   * Errors accessor for the field. This property is used for
   * accessing the error/s or updating them.
   * The set value will be looked up from the locale dictionary
   * or it can be set as object to provide arguments for the interpolation.
   */
  errors?: null | string | string[] | ITranslatePath | ITranslatePath[] ;
  /**
   * Whether the field is required or not.
   */
  required?: boolean;
  /**
   * Function to validate the field value. It receives all fields in the
   * form as first argument, and second as the current field's value.
   * You can also access to translator helper from inside the function with `this.$t`.
   *
   * If the returning type is `string` it will be displayed as error message.
   *
   * This function can also be `async`
   *
   * @example
   *```js
   * function(fields, value){
   *   if(!value){
   *     return this.$t('errors.field_required', { field: 'Field Name' })
   *   }
   *   return true
   * }
   * ```
   */
  validator?: FieldValidator<keyof AdditionalFields>;
}

type FormRef = ReturnType<typeof createForm> & {
  toggleAlert(message?: string | null, options?: Partial<PAlertProps>): void
}
export interface IWidgetSettings {
  apiUrl: string;
  locale: ILocaleSettings;
  mode?: string
  modeOptions: Partial<Record<WidgetModes, {
    fields?: AdditionalFields,
    preAction?: (
      values: any,
      fields: Record<string, FieldDefinition>,
      form: FormRef
    ) => Promise<void> | void,
    postAction?: (
      values: any,
      fields: Record<string, FieldDefinition>,
      form: FormRef) => Promise<void> | void,
    responseErrorHandler?: (
      err: Error,
      form: FormRef,
      fields: AdditionalFields
    ) => void
  }>>,
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
  tenant_login_url: string
}

export interface IPlusAuthContext {
  client: IClient;
  connection?: {
    name: string
    type: string
  },
  error?: {
    error: string,
    error_description: string,
  },
  settings: Partial<ITenantSettings>;
  details: Record<string, any>;
  params: any;
  prompt?: {
    name: string,
    mode?: string
  },
  ui_locales: string[]
}

export type ITranslatePath = string | {
  path: string,
  args?: Record<string, any> | any[],
  locale?: string
  fallback?: string
}
