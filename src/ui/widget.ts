import type { DefineComponent } from 'vue';
import { defineComponent, h, ref, onBeforeUnmount, inject } from 'vue';
import './styles/main.css'

import { RouterView, useRoute } from 'vue-router';

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
import PasswordlessEmail from './views/passwordless/Email.vue';
import PasswordlessPush from './views/passwordless/Push.vue';
import PasswordlessSMS from './views/passwordless/SMS.vue';
import Register from './views/Register.vue';
import ResetPassword from './views/ResetPassword.vue';
import VerifyEmail from './views/VerifyEmail.vue';

function resolveViewFromValue(value = ''):
DefineComponent<any, any, any, any, any, any, any, any, any, any>{
  const route = useRoute()
  if (route.matched.length > 0) {
    return RouterView
  }
  switch (value.toLowerCase().replace('-', '').replace('_','')){
    case 'login':
    case 'signin':
      return Login;
    case 'register':
    case 'signup':
      return Register;
    case 'mfa':
    case 'challenge':
    case 'mfachallenge':
      return MFAChallenge;
    case 'passwordlessemail':
      return PasswordlessEmail
    case 'passwordlesspush':
      return PasswordlessPush
    case 'passwordlesssms':
      return PasswordlessSMS
    case 'email':
    case 'mfaemail':
      return MFAEmail;
    case 'sms':
    case 'mfasms':
      return MFASMS;
    case 'push':
    case 'mfapush':
      return MFASMS;
    case 'otp':
    case 'mfaotp':
      return MFAOTP;
    case 'fv':
    case 'mfafv':
      return MFAFingerVein;
    case 'verifyemail':
      return VerifyEmail;
    case 'consent':
      return Consent;
    case 'recovery':
    case 'forgotpassword':
    case 'passwordrecovery':
      return ForgotPassword;
    case 'resetpassword':
      return ResetPassword;
    case 'fillmissing':
    case 'updatemissinginformation':
      return FillMissing;
    default:
      return RouterView
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
        resolvedView: resolveViewFromValue(settings.mode),
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
                  this.resolvedView,
                  this.resolvedView === RouterView ? {} :
                    settings.mode && settings.modeOptions
                    && settings.modeOptions[settings.mode.toLowerCase()]
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

