/* eslint-disable max-len */
export default {
  common: {
    allow: 'Allow',
    fields: {
      code: 'Code',
      email: 'Email',
      newPassword: 'New Password',
      password: 'Password',
      phone_number: 'Phone number',
      rePassword: 'Password confirmation',
      username: 'Username'
    },
    hide: 'Hide',
    reject: 'Reject',
    show: 'Show',
    submit: 'Submit'
  },
  consent: {
    allow: 'Allow',
    reject: 'Reject',
    title: '{clientName} asks for your consent for the followings'
  },
  errors: {
    email_not_verified: 'Email is not verified. Please verify your email by clicking the link that has been sent to your email account.',
    fieldNotValid: '{0} is not valid.',
    fieldRequired: '{0} is required.',
    invalid_credentials: 'Invalid login credentials. Please try again.',
    passwordsNotMatch: "Passwords doesn't match"
  },
  fillMissing: {
    title: 'Fill missing information'
  },
  forgotPassword: {
    emailSent: 'If there is an account with {email.value} you will receive an email containing a link to reset your password.',
    subtitle: 'Please enter your email address to request a password reset',
    title: 'Reset your password'
  },
  login: {
    forgotPassword: 'Forgot Password',
    noAccount: "Don't have an account?",
    signIn: 'Sign In',
    signInWith: 'or Sign in with',
    signUp: 'Sign Up'
  },
  mfa: {
    challenge: {
      email: 'Email',
      otp: 'Authenticator Application',
      sms: 'SMS',
      title: 'Try another way to sign in'
    },
    email: {
      'title|html': 'Enter verification code sent to: <strong>{email}</strong>'
    },
    otp: {
      title: 'Enter verification code:'
    },
    sms: {
      'title|html': 'Enter verification code sent to: <strong>{phone_number}</strong>'
    },
    tryAnotherWay: 'Try another way'
  },
  passwordPolicy: {
    customChars: 'At least one of {0}',
    customRegexp: '',
    lowerCase: 'At least {0} lowercase character',
    max: 'Maximum {0} character',
    min: 'Minimum {0} character',
    number: 'At least {0} number',
    upperCase: 'At least {0} uppercase character'
  },
  register: {
    haveAccount: 'Have an account?',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signUpWith: 'or Sign Up with'
  },
  resetPassword: {
    successfullyReset: 'Your password has been successfully reset.',
    title: 'Reset Password'
  }
}
