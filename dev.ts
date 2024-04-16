import PlusAuthWidget from './src';

window['PlusAuth'] = {
  ui_locales: [
    { name: 'Turkce', value: 'tr' },
    { name: 'English', value: 'en' },
  ],
  client: {
    clientName: 'TestApp',
    tosUri: 'https://sometosuri.com',
    policyUri: 'https://somepolicyuri.com',
    logoUri: 'https://static.plusauth.com/images/logo.png',
    social: [
      { name: 'google-connection', provider: 'google' },
      { name: 'facebook-connection', provider: 'facebook' },
    ]
  },
  settings: {
    register_enabled: true,
    forgot_password_enabled: true,
    password_policy: {
      min: 4,
      max: 16,
      lower_case: 4
    }
  },
  details: {
    push_code: '02',
    phone_number: '+90********23',
    scopes: {
      new: ['read:a', 'write:subscription', 'write:user', 'read:user']
    },
    tenantLoginUrl: 'http://dashboard.plusauth.com',
    email: 'test@plusauth.com',
    fields: [
      {
        name: 'email',
        type: 'text',
        format: 'email'
      }
    ],
    challenges: [
      'sms',
      'email',
      'otp',
      'sc',
      'webauthn',
      'fv'
    ]
  }
}
const auth = new PlusAuthWidget('#pa__app', {
  locale: {
    defaultLocale: 'en',
    dictionary: {
      tr: {
        errors: {
          field_required: 'Alan zorunlu'
        },
        common: {

          edit: 'Degistir'
        },
        login: {
          signIn: 'Giris yap'
        }
      }
    }
  },
  footer: {
    enabled: true
  },
  // socialLogin: {
  //   buttonVariant: 'circle' // 'block' by default
  // },
  modeOptions: {
    login: {
      fields: {
        email: null,
        username: {
          type: 'text',
          label: 'Username',
          attrs: {
            autocomplete: 'email'
          },
        },
      }
    },

    signup: {
      fields: {
        username: undefined,
        email: {
          type: 'text',
          label: 'Email',
          attrs: {
            autocomplete: 'email'
          },
        },
      }
    }
  }
}, window['PlusAuth'])

setTimeout(() => {
  auth.view.modeOptions.login!.fields!.username!.value = 'test@test.com'
  auth.view.modeOptions.login!.fields = {
    username: null,
    email: {
      type: 'text',
      label: 'Email',
      attrs: {
        autocomplete: 'email'
      },
    },
  }

}, 200)
// auth.view.mode = 'mfapush'
