import type { Component } from 'vue';

import AccountLinking from '../views/AccountLinking.vue';
import Consent from '../views/Consent.vue';
import FillMissing from '../views/FillMissing.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Login from '../views/Login.vue';
import MFAChallenge from '../views/mfa/Challenge.vue';
import MFAEmail from '../views/mfa/Email.vue';
import MFAFingerVein from '../views/mfa/FingerVein.vue';
import MFAOTP from '../views/mfa/OTP.vue';
import MFAPush from '../views/mfa/Push.vue';
import MFASMS from '../views/mfa/SMS.vue';
import MFAWebauthN from '../views/mfa/WebAuthN.vue';
import PasswordlessEmail from '../views/passwordless/Email.vue';
import PasswordlessOTP from '../views/passwordless/OTP.vue';
import PasswordlessPush from '../views/passwordless/Push.vue';
import PasswordlessSMS from '../views/passwordless/SMS.vue';
import Register from '../views/Register.vue';
import ResetPassword from '../views/ResetPassword.vue';
import VerifyEmail from '../views/VerifyEmail.vue';

export function resolveView(mode?: string): Component<any, any, any, any, any> | undefined {
  const m = mode ? mode.toLowerCase().replaceAll('-', '').replaceAll('_', '') : ''
  const pathname = document.baseURI === window.location.href  ? window.location.pathname : window.location.href.replace(document.baseURI, '')
  const parts = (pathname.startsWith('/') ? pathname: `/${pathname}`).split('/').slice(1)

  if (m === 'consent' || parts[0] === 'signin' && parts[1] === 'consent') {
    return Consent
  }
  if (m === 'passwordrecovery' || parts[0] === 'signin' && parts[1] === 'recovery') {
    return ForgotPassword
  }

  if (parts[0] === 'signin' || m.startsWith('passwordless')) {
    // PASSWORDLESS

    if (m === 'passwordlessemail' || parts[1] === 'passwordless' && parts[2] === 'email') {
      return PasswordlessEmail
    }
    if (m === 'passwordlesssms' || parts[1] === 'passwordless' && parts[2] === 'sms') {
      return PasswordlessSMS
    }
    if (m === 'passwordlessotp' || parts[1] === 'passwordless' && parts[2] === 'otp') {
      return PasswordlessOTP
    }
    if (m === 'passwordlesspush' || parts[1] === 'passwordless' && parts[2] === 'push') {
      return PasswordlessPush
    }
  }

  if (parts[0] === 'signin' || m.startsWith('mfa')) {

    // MFA CHALLENGES
    if (m === 'mfaemail' || parts[1] === 'challenge' && parts[2] === 'email') {
      return MFAEmail
    }
    if (m === 'mfafv' || parts[1] === 'challenge' && parts[2] === 'fv') {
      return MFAFingerVein
    }
    if (m === 'mfasms' || parts[1] === 'challenge' && parts[2] === 'sms') {
      return MFASMS
    }
    if (m === 'mfaotp' || parts[1] === 'challenge' && parts[2] === 'otp') {
      return MFAOTP
    }
    if (m === 'mfapush' || parts[1] === 'challenge' && parts[2] === 'push') {
      return MFAPush
    }
    if (m === 'mfawebauthn' || parts[1] === 'challenge' && parts[2] === 'webauthn') {
      return MFAWebauthN
    }
    if (m === 'mfa' || parts[1] === 'challenge') {
      return MFAChallenge
    }
  }

  if (m === 'login' || parts[0] === 'signin' ) {
    return Login
  }

  if (m === 'register' || parts[0] === 'signup' && !parts[1]) {
    return Register
  }

  if (m === 'verifyemail' || parts[0] === 'account' && parts[1] === 'verifyEmail') {
    return VerifyEmail
  }
  if (m === 'fillmissing' || parts[0] === 'account' && parts[1] === 'updateMissingInformation') {
    return FillMissing
  }
  if (m === 'resetpassword' || parts[0] === 'account' && parts[1] === 'resetPassword') {
    return ResetPassword
  }
  if (m === 'accountlinking' || parts[0] === 'account' && parts[1] === 'link-identity') {
    return AccountLinking
  }
}
