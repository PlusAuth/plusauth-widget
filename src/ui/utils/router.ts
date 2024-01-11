import type { DefineComponent } from 'vue';

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

export function resolveView(mode?: string): DefineComponent<any, any, any, any, any> {
  mode = mode ? mode.toLowerCase().replaceAll('-', '').replaceAll('_', '') : ''
  const parts = window.location.pathname.split('/').slice(1)

  if (mode === 'consent' || parts[0] === 'signin' && parts[1] === 'consent') {
    return Consent
  }
  if (mode === 'passwordrecovery' || parts[0] === 'signin' && parts[1] === 'recovery') {
    return ForgotPassword
  }

  if (mode === 'login' || parts[0] === 'signin') {
    return Login
  }

  if (mode === 'register' || parts[0] === 'signup') {
    return Register
  }


  // PASSWORDLESS

  if (mode === 'passwordlessemail' || parts[1] === 'passwordless' && parts[2] === 'email') {
    return PasswordlessEmail
  }
  if (mode === 'passwordlesssms' || parts[1] === 'passwordless' && parts[2] === 'sms') {
    return PasswordlessSMS
  }
  if (mode === 'passwordlessotp' || parts[1] === 'passwordless' && parts[2] === 'otp') {
    return PasswordlessOTP
  }
  if (mode === 'passwordlesspush' || parts[1] === 'passwordless' && parts[2] === 'push') {
    return PasswordlessPush
  }

  // MFA CHALLENGES
  if (mode === 'mfaemail' || parts[1] === 'challenge' && parts[2] === 'email') {
    return MFAEmail
  }
  if (mode === 'mfafv' || parts[1] === 'challenge' && parts[2] === 'fv') {
    return MFAFingerVein
  }
  if (mode === 'mfasms' || parts[1] === 'challenge' && parts[2] === 'sms') {
    return MFASMS
  }
  if (mode === 'mfaotp' || parts[1] === 'challenge' && parts[2] === 'otp') {
    return MFAOTP
  }
  if (mode === 'mfapush' || parts[1] === 'challenge' && parts[2] === 'push') {
    return MFAPush
  }
  if (mode === 'mfawebauthn' || parts[1] === 'challenge' && parts[2] === 'webauthn') {
    return MFAWebauthN
  }
  if (mode === 'mfa' || parts[1] === 'challenge') {
    return MFAChallenge
  }


  if (mode === 'verifyemail' || parts[0] === 'account' && parts[1] === 'verifyEmail') {
    return VerifyEmail
  }
  if (mode === 'fillmissing' || parts[0] === 'account' && parts[1] === 'updateMissingInformation') {
    return FillMissing
  }
  if (mode === 'resetpassword' || parts[0] === 'account' && parts[1] === 'resetPassword') {
    return ResetPassword
  }
}
