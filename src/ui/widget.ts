import type { DefineComponent } from 'vue';
import { defineComponent, h, ref, onBeforeUnmount, inject } from 'vue';
import './styles/main.css'

import PFooter from './components/Footer.vue';
import type { IWidgetSettings } from './interfaces';
import type { Theme } from './utils/theme';
import type { Translator } from './utils/translator';
import { translatorKey } from './utils/translator';
import Consent from './views/Consent.vue';
import FillMissing from './views/FillMissing.vue';
import ForgotPassword from './views/ForgotPassword.vue';
import Login from './views/Login.vue';
import MFAChallenge from './views/mfa/Challenge.vue';
import MFAEmail from './views/mfa/Email.vue';
import MFAFingerVein from './views/mfa/FingerVein.vue';
import MFAOTP from './views/mfa/OTP.vue';
import MFAPush from './views/mfa/Push.vue';
import MFASMS from './views/mfa/SMS.vue';
import MFAWebauthN from './views/mfa/WebAuthN.vue';
import PasswordlessEmail from './views/passwordless/Email.vue';
import PasswordlessOTP from './views/passwordless/OTP.vue';
import PasswordlessPush from './views/passwordless/Push.vue';
import PasswordlessSMS from './views/passwordless/SMS.vue';
import Register from './views/Register.vue';
import ResetPassword from './views/ResetPassword.vue';
import VerifyEmail from './views/VerifyEmail.vue';

function resolveView():
DefineComponent<any, any, any, any, any, any, any, any, any, any>{
  const parts = window.location.pathname.split('/').slice(1)
  if (parts[0] === 'signin'){
    if (!parts[1]){
      return Login
    }
    if (parts[1] === 'consent'){
      return Consent
    }
    if (parts[1] === 'recovery'){
      return ForgotPassword
    }
    if (parts[1] === 'passwordless'){
      if (parts[2] === 'email'){
        return PasswordlessEmail
      }
      if (parts[2] === 'sms'){
        return PasswordlessSMS
      }
      if (parts[2] === 'otp'){
        return PasswordlessOTP
      }
      if (parts[2] === 'push'){
        return PasswordlessPush
      }
      return undefined
    }
    if (parts[1] === 'challenge'){
      if (!parts[2]){
        return MFAChallenge
      }
      if (parts[2] === 'email'){
        return MFAEmail
      }
      if (parts[2] === 'fv'){
        return MFAFingerVein
      }
      if (parts[2] === 'sms'){
        return MFASMS
      }
      if (parts[2] === 'otp'){
        return MFAOTP
      }
      if (parts[2] === 'push'){
        return MFAPush
      }
      if (parts[2] === 'webauthn'){
        return MFAWebauthN
      }
      return undefined
    }
  }
  if (parts[0] === 'signup'){
    return Register
  }
  if (parts[0] === 'account'){
    if (parts[1] === 'verifyEmail'){
      return VerifyEmail
    }
    if (parts[1] === 'updateMissingInformation'){
      return FillMissing
    }
    if (parts[1] === 'resetPassword'){
      return ResetPassword
    }
  }
}
export default function (theme: Theme, settings: Partial<IWidgetSettings>): any {
  return defineComponent({
    provide: {
      theme
    },
    setup(){
      const isMobile = ref(false)
      const i18n = inject(translatorKey) as Translator
      function onResize() {
        isMobile.value = window.innerWidth < 600
      }
      window.addEventListener('resize', onResize, { passive: true })
      onResize()

      onBeforeUnmount(() => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', onResize)
        }
      })
      return {
        resolvedView: resolveView(),
        isMobile,
        locale: i18n.localeRef
      }
    },
    render(){
      return h(
        'div',
        {
          class: 'pa__widget',
          key: this.locale
        },
        h('div', { class: 'pa__widget-content' },
          [
            h(
              'div',
              {
                class: ['pa__widget-content-main']
              },
              [
                h(
                  this.resolvedView
                )
              ]
            ),
            settings.footer && settings.footer.enabled && h(PFooter as any,
              { class: 'pa__widget-footer' })
          ] )

      )
    }
  });
}

