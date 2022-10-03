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
    verify: 'Verify',
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
    fv: {
      'enrollRequired': 'You must enroll at least one finger',
      '9999': 'Invalid request',
      '0x100010e': 'Capture timeout',
      '0x1000118': 'Capture cancelled',
      '0x3001001': 'Device initialization failed',
      '0x3001002': 'Invalid licence',
      '0x3001003': 'Invalid parameters',
      '0x3001004': 'Template count should be more than zero',
      '0x3001005': 'Encryption error',
      '0x3001006': 'Internal error',
      '0x3000006': 'Finger placement is not correct',
      '0x300000e': 'Finger not matched',
      '0x2000011': 'Device disconnected',
      '0x02000011': 'Device disconnected',
      '0x02000021': 'Device disconnected',
      '0x03000001': 'Scanner device not found',
      '0x03000002': 'Invalid BIR format',
      '0x03000003': 'Base64 encode failed',
      '0x03000004': 'Invalid BIR out parameter',
      '0x03000005': 'Verification capture was not close enough to match',
      '0x03000006': 'Finger capture consistency check failed',
      '0x03000007': 'Too many retries',
      '0x03000008': 'Scanner error invalid parameter',
      '0x03000009': 'General scanner error',
      '0x0300000A': 'Scanner error match failed',
      '0x0300000B': 'No template to verify against',
      '0x0300000C': 'No device detected',
      '0x0300000D': 'Could not allocate enough memory internally',
      '0x0300000E': 'Finger verification does not match',
      '0x0300000F': 'Finger identification no match found',
      '0x03000010': 'Finger identification multiple matches',
    },
    webauthn: {
      not_supported: 'Looks like your browser is not supporting WebAuthN API. Try upgrading your browser or use a supported one.',
      operation_failed: 'Operation failed with error:'
    },
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
    weak_password: 'Password is too weak',
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
      fv: 'Finger Vein',
      webauthn: 'Security Key or Device',
      sc: 'SmartCard/E-Signature',
      otp: 'Authenticator Application',
      sms: 'SMS',
      title: 'Select one of following methods'
    },
    email: {
      title: 'Enter authorization code sent to: <strong>{email}</strong>'
    },
    fv: {
      enrollmentInProgress: 'Enrollment in progress',
      verifyInProgress: 'Verification in progress',
      saving: 'Saving enrollments',
      checkingDevice: 'Checking device connectivity',
      checkDevice: 'Make sure your device is connected and necessary software is installed. Refresh this page when device is ready.',
      enroll: 'Select a finger to enroll. You can enroll multiple fingers.',
      verify: 'Click to <strong>VERIFY</strong> when you are ready to scan your finger.'
    },
    otp: {
      title: 'Enter authorization code:'
    },
    sms: {
      title: 'Enter authorization code sent to: <strong>{phone_number}</strong>'
    },
    webauthn: {
      verifying: 'Verifying your credentials...'
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
