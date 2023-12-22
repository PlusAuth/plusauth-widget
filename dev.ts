import PlusAuthWidget from './src';

window['PlusAuth'] = {
  ui_locales: [
    {name: 'Turkce', value: 'tr'},
    {name: 'English', value: 'en'},
  ],
  client: {
    clientName: 'TestApp',
    tosUri: 'https://sometosuri.com',
    policyUri: 'https://somepolicyuri.com',
    logoUri: 'https://static.plusauth.com/images/logo.png',
    social: [
      {name: 'google-connection', provider: 'google'},
      {name: 'facebook-connection', provider: 'facebook'},
    ]
  },
  features: {
    socialConnections: true
  },
  autoSignIn: false,
  details: {
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
  modeOptions: {
    login: {
      fields: {
        username: undefined,
        email: {
          type: 'text',
          errors: [],
          format: 'email',
          label: 'Email',
          attrs: {
            autocomplete: 'username'
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
  auth.view.modeOptions.login.fields.email.value ='test@test.com'
}, 100)
auth.view.mode = 'login'
