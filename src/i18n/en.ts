export default {
  $locale: 'English',
  common: {
    allow: 'Allow',
    code: 'code',
    continue: 'Continue',
    days: 'days',
    downloadAuthPlus: 'You can download {0} from your app store',
    edit: 'Edit',
    email: 'email',
    enterOtp: 'Enter your @:common.code',
    field: 'Field',
    user: 'User',
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
    hours: 'hours',
    minutes: 'minutes',
    notification: 'notification',
    reject: 'Reject',
    resend: 'Resend',
    resendText: "Didn't receive the {type}?",
    resendAfter: 'Resend in: {time}',
    seconds: 'seconds',
    show: 'Show',
    submit: 'Submit',
    verify: 'Verify',
    years: 'years',
    usePassword: 'Use you password instead'
  },
  verifyEmail: {
    title: 'Check Your @:common.email',
    checkText: "We\'ve sent an email to <strong>{email}</strong>, please click the link included to verify your @:common.email address.",
    successTitle: 'Your email verified successfully.',
    redirectingText: ' Redirecting to application in {time} seconds.',
    emailType: '@:common.email'
  },
  consent: {
    allow: '@:common.allow',
    reject: '@:common.reject',
    title: '{clientName} asks for your consent for the followings',
    groups: {
      base: 'Base Attributes',
      claims: 'Claims'
    }
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
    already_exists: '@:common.user already exists',
    code_already_used: '@:common.code was already used',
    code_expired: '@:common.code has expired',
    email_not_verified: '@:common.email is not verified. Please verify your @:common.email by clicking the link that has been sent to your @:common.email account.',
    invalid_entity: 'Invalid {field}',
    field_required: '{field} is required.',
    incorrect_code: 'Verification @:common.code is invalid',
    invalid_code: '@:common.code is invalid',
    invalid_credentials: 'Invalid @:login.signIn credentials. Please try again.',
    invalid_password: 'Invalid @:common.fields.password provided.',
    passwords_not_match: "Passwords doesn't match",
    user_not_found: '@:common.user not found',
    weak_password: '@:common.fields.password is too weak',
    too_many_requests: 'You have ben trying too fast. Try again in {retry}.',
    account_blocked: 'Your account is blocked. Please check your @:common.email for further instructions or contact an administrator.',
    old_password: 'It looks like you\'re trying to use a @:common.fields.password you\'ve used before. For your security, please choose a new @:common.fields.password that hasn\'t been used in the past.'
  },
  fillMissing: {
    title: 'Fill missing information',
    subtitle: 'Please fill in additional information required to proceed application.',
    fieldLabel: 'common.fields.{0}',
    fieldRequiredError: '@:errors.field_required',
    submitAction: '@:common.submit'
  },
  forgotPassword: {
    title: 'Reset your @:common.fields.password',
    subtitle: 'Please enter your @:common.email address to request a @:common.fields.password reset',
    emailSent: 'If there is an account with <strong>{email}</strong> you will receive an @:common.email containing a link to reset your @:common.fields.password.',
    emailLabel: '@:common.fields.email',
    submitAction: '@:common.submit',
    userNotFoundError: '@:errors.user_not_found'
  },
  login: {
    title: 'Sign In',
    signIn: 'Sign In',
    signInWith: 'Sign in with {0}',
    socialLoginHelper: 'or',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
    forgotPassword: 'Forgot Password',
    emailLabel: '@:common.fields.email',
    phoneLabel: '@:common.fields.phone_number',
    passwordLabel: '@:common.fields.password',
    userNotFoundError: '@:errors.user_not_found',
    invalidPasswordError: '@:errors.invalid_password'
  },
  accountLinking: {
    title: 'Link Account',
    description: 'It appears that an account is already associated with your @:common.email address. Please verify ownership to proceed.',
    passwordLabel: '@:common.fields.password',
    continueAction: '@:common.continue',
    submitAction: '@:common.submit',
    userNotFoundError: '@:errors.user_not_found',
    invalidPasswordError: '@:errors.invalid_password'
  },
  passwordless: {
    challenge: {
      title: 'Select one of following methods',
    },
    useAnotherMethod: 'Sign in with another method',
    email: {
      title: 'Enter authorization @:common.code sent to: <strong>{email}</strong>',
      magicLinkTitle: 'Check your @:common.email',
      checkText: "We\'ve sent an @:common.email to <strong>{email}</strong>, please click the link included to sign in. Make sure to open link in the same device/browser you are trying to sign in.",
      codeLabel: '@:common.fields.code',
      submitAction: '@:common.submit',
      useAnotherMethod: 'Sign in with another method',
      invalidCodeError: '@:errors.invalid_code',
      emailType: '@:common.email'
    },
    otp: {
      title: 'Enter authorization @:common.code',
      registerTitle: 'Register Your Authenticator',
      registerSubtitle: 'Open your preferred authenticator application and scan the QRCode below. If you have trouble scanning the @:common.code you can manually enter the @:common.code below image.',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      useAnotherMethod: '@:passwordless.email.useAnotherMethod'
    },
    sms: {
      title: 'Enter authorization @:common.code sent to: <strong>{phone_number}</strong>',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      useAnotherMethod: '@:passwordless.email.useAnotherMethod',
      codeType: '@:common.code'
    },
    push: {
      enrollTitle: 'Register your device',
      enrollDescription: 'Scan the QR @:common.code below with your {0} application',
      title: 'Check your device',
      selectCode: 'Select number below from your device',
      description: 'Click on @:common.notification in your device to allow access',
      otpTitle: '@:mfa.otp.title',
      otpLabel: '@:common.enterOtp',
      waitingApproval: '@:mfa.challenge.waitingApproval',
      submitAction: '@:common.submit',
      continueAction: '@:common.continue',
      useAnotherMethod: '@:passwordless.email.useAnotherMethod',
      tryCodeAction: 'Try entering @:common.code manually',
      notificationType: '@:common.notification',
      invalidCodeError: '@:errors.invalid_code'
    },
    webauthn: {
      title: 'Click @:common.continue to use your passkey',
      verifying: 'Verifying your credentials...',
      continueAction: '@:common.continue',
      useAnotherMethod: '@:passwordless.email.useAnotherMethod',
      notSupportedError: '@:errors.webauthn.not_supported',
      operationFailedError: '@:errors.webauthn.operation_failed'
    },
    pw: {
      choice: 'Continue with @:common.fields.password'
    }
  },
  mfa: {
    challenge: {
      email: '@:common.email',
      fv: 'Finger Vein',
      webauthn: 'Security Key or Device',
      sc: 'SmartCard/E-Signature',
      otp: 'Authenticator Application',
      sms: 'SMS',
      title: 'Select one of following methods',
      waitingApproval: 'Waiting for approval on your device…'
    },
    email: {
      title: 'Enter authorization @:common.code sent to: <strong>{email}</strong>',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      tryAnotherWay: '@:mfa.tryAnotherWay',
      emailType: '@:common.email'
    },
    fv: {
      checkingDevice: 'Checking device connectivity',
      enrollmentInProgress: 'Enrollment in progress',
      saving: 'Saving enrollments',
      verifyInProgress: '@:common.verify in progress',
      enroll: 'Select a finger to enroll. You can enroll multiple fingers.',
      checkDevice: 'Make sure your device is connected and necessary software is installed. Refresh this page when device is ready.',
      verify: 'Click to <strong>@:common.verify</strong> when you are ready to scan your finger.',
      fingerEnrolledSuccess: 'Finger Enrolled',
      enrollRequiredError: '@:errors.fv.enrollRequired',
      submitAction: '@:common.submit',
      verifyAction: '@:common.verify',
      tryAnotherWay: '@:mfa.tryAnotherWay'
    },
    otp: {
      title: 'Enter authorization @:common.code',
      registerTitle: 'Register Your Authenticator',
      registerSubtitle: 'Open your preferred authenticator application and scan the QRCode below. If you have trouble scanning the @:common.code you can manually enter the @:common.code below image.',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      tryAnotherWay: '@:mfa.tryAnotherWay'
    },
    push: {
      enrollTitle: 'Register your device',
      enrollDescription: 'Scan the QR @:common.code below with your {0} application',
      title: 'Check your device',
      selectCode: 'Select number below from your device',
      description: 'Click on @:common.notification in your device to allow access',
      otpTitle: '@:mfa.otp.title',
      otpLabel: '@:common.enterOtp',
      submitAction: '@:common.submit',
      continueAction: '@:common.continue',
      tryAnotherWay: '@:mfa.tryAnotherWay',
      tryCodeAction: 'Try entering @:common.code manually',
      notificationType: '@:common.notification'
    },
    sms: {
      title: 'Enter authorization @:common.code sent to: <strong>{phone_number}</strong>',
      codeLabel: '@:common.fields.code',
      submitAction: '@:common.submit',
      tryAnotherWay: '@:mfa.tryAnotherWay'
    },
    webauthn: {
      title: 'Click @:common.continue to use your passkey',
      verifying: 'Verifying your credentials...',
      submitAction: '@:common.submit',
      tryAnotherWay: '@:mfa.tryAnotherWay',
      notSupportedError: '@:errors.webauthn.not_supported',
      operationFailedError: '@:errors.webauthn.operation_failed'
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
  passwordChallenge: {
    title: '@:login.title',
    passwordLabel: '@:common.fields.password',
    continueAction: '@:common.continue',
    forgotPassword: '@:login.forgotPassword',
    userNotFoundError: '@:errors.user_not_found',
    invalidPasswordError: '@:errors.invalid_password'
  },
  register: {
    haveAccount: 'Have an account?',
    title: 'Sign Up',
    signIn: '@:login.signIn',
    signUp: '@:login.signUp',
    signUpWith: 'Sign Up with {0}',
    socialLoginHelper: '@:login.socialLoginHelper',
    emailLabel: '@:common.fields.email',
    phoneLabel: '@:common.fields.phone_number',
    passwordLabel: '@:common.fields.password',
    rePasswordLabel: '@:common.fields.rePassword',
    passwordMismatchError: '@:errors.passwords_not_match',
    alreadyExistsError: '@:errors.already_exists',
    forgotPassword: '@:login.forgotPassword'
  },
  resetPassword: {
    title: 'Reset @:common.fields.password',
    successfullyReset: 'Your @:common.fields.password has been successfully reset.',
    newPasswordLabel: '@:common.fields.newPassword',
    rePasswordLabel: '@:common.fields.rePassword',
    passwordMismatchError: '@:errors.passwords_not_match',
    submitAction: '@:common.submit'
  },
}