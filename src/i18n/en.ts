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
    field: 'Field',
    hide: 'Hide',
    reject: 'Reject',
    show: 'Show',
    submit: 'Submit'
  },
  verifyEmail: {
    checkText: "We\'ve sent an email to <strong>{email}</strong>, please click the link included" +
      ' to verify your email address.',
    resendText: 'Didn\'t receive email?',
    resendAction: 'Resend',
    title: 'Check Your Email'
  },
  consent: {
    allow: 'Allow',
    reject: 'Reject',
    title: '{clientName} asks for your consent for the followings'
  },
  errors: {
    already_exists: 'User already exists',
    code_already_used: 'Code was already used',
    code_expired: 'Code has expired',
    email_not_verified: 'Email is not verified. Please verify your email by clicking the link that has been sent to your email account.',
    field_required: '{0} is required.',
    incorrect_code: 'Verification code is invalid',
    invalid_code: 'Code is invalid',
    invalid_entity: 'Invalid {field}',
    invalid_credentials: 'Invalid login credentials. Please try again.',
    invalid_password: 'Invalid password provided.',
    passwords_not_match: "Passwords doesn't match",
    user_not_found: 'User not found',
    too_many_requests: 'You have ben trying too fast. Try again in {retry} seconds.',
    account_blocked: 'Your account is blocked. Please check your email for further instructions.',
  },
  fillMissing: {
    title: 'Fill missing information',
    subtitle: 'Please fill in additional information required to proceed application.',
  },
  forgotPassword: {
    'emailSent': 'If there is an account with <strong>{email}</strong> you will receive an' +
      ' email' +
      ' containing a link to reset your password.',
    subtitle: 'Please enter your email address to request a password reset',
    title: 'Reset your password'
  },
  login: {
    forgotPassword: 'Forgot Password',
    noAccount: "Don't have an account?",
    title: 'Sign In',
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
      'title': 'Enter authorization code sent to: <strong>{email}</strong>'
    },
    otp: {
      title: 'Enter authorization code:'
    },
    sms: {
      'title': 'Enter authorization code sent to: <strong>{phone_number}</strong>'
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
    title: 'Sign Up',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signUpWith: 'or Sign Up with'
  },
  resetPassword: {
    successfullyReset: 'Your password has been successfully reset.',
    title: 'Reset Password'
  }
}
