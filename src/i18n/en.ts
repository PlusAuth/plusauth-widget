export default {
  consent: {
    allow: 'Allow',
    reject: 'Reject',
    title: '{clientName} asks for your consent for the followings'
  },
  login: {
    errors: {
      passwordRequired: 'Password is required',
      usernameRequired: 'Username is required',
    },
    forgotPassword: 'Forgot Password',
    noAccount: 'Don\'t have an account?',
    password: 'Password',
    showPassword: 'SHOW',
    hidePassword: 'HIDE',
    signIn: 'Sign In',
    signInWith: 'or Sign in with',
    signUp: 'Sign Up',
    username: 'Username'
  },
  fillMissing: {
    errors: {
      phone_numberRequired: 'Phone Number is required',
      password: 'Password is required'
    },
    title: 'Fill missing information',
    phone_number: 'Phone number',
    password: 'Password',
    submit: 'Submit',
  },
  forgotPassword: {
    errors: {
      emailRequired: 'Email is required',
      notValidEmail: 'Please enter a valid email address',
    },
    email: 'Email',
    emailSent: 'If there is an account with {email.value} you will receive an email containing a' +
      ' link to reset your password.',
    submit: 'Submit',
    subtitle: 'Please enter your email address to request a password reset',
    title: 'Reset your password'
  },
  mfa: {
    challenge: {
      email: 'Email',
      otp: 'Google Authenticator',
      sms: 'SMS',
      title: 'Try another way to sign in'
    },
    email: {
      code: 'Code',
      errors: {
        codeRequired: 'Code required'
      },
      submit: 'Submit',
      title: 'Enter verification code sent to: {email}'
    },
    sms: {
      code: 'Code',
      errors: {
        codeRequired: 'Code required'
      },
      submit: 'Submit',
      title: 'Enter verification code sent to: {phone_number}'
    },
    otp: {
      title: 'Enter verification code:'
    },
    tryAnotherWay: 'Try another way'
  },
  register: {
    errors: {
      passwordRequired: 'Password is required',
      passwordsNotMatch: 'Passwords doesn\'t match',
      rePasswordRequired: 'Password confirmation is required',
      usernameRequired: 'Username is required'
    },
    haveAccount: 'Have an account?',
    password: 'Password',
    rePassword: 'Confirm Password',
    showPassword: 'SHOW',
    hidePassword: 'HIDE',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signUpWith: 'or Sign Up with',
    username: 'Username'
  },
  resetPassword: {
    title: 'Reset Password',
    errors: {
      newPasswordRequired: 'Password is required',
      passwordsNotMatch: 'Passwords doesn\'t match',
      rePasswordRequired: 'Password confirmation is required'
    },
    informNewPassword: 'This is your temporary password.',
    newPassword: 'New Password',
    rePassword: 'Confirm Password',
    submit: 'Submit',
    successfullyReset: 'Your password has been successfully reset.'
  },
  passwordPolicy: {
    min: 'Minimum {0} character',
    max: 'Maximum {0} character',
    number: 'At least {0} number',
    lowerCase: 'At least {0} lowercase character',
    upperCase: 'At least {0} uppercase character',
    customChars: 'At least one of {0}',
    customRegexp: ''
  }
}
