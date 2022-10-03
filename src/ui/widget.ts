import { defineComponent, h, ref,onBeforeUnmount, DefineComponent } from 'vue';
import './styles/main.sass'

import { RouterView, useRoute } from 'vue-router';

import PFooter from './components/Footer.vue';
import { IWidgetSettings } from './interfaces';
import { Theme } from './utils/theme';
import Consent from './views/Consent.vue';
import FillMissing from './views/FillMissing.vue';
import ForgotPassword from './views/ForgotPassword.vue';
import Login from './views/Login.vue';
import Challenge from './views/mfa/Challenge.vue';
import Email from './views/mfa/Email.vue';
import FingerVein from './views/mfa/FingerVein.vue';
import OTP from './views/mfa/OTP.vue';
import SMS from './views/mfa/SMS.vue';
import Register from './views/Register.vue';
import ResetPassword from './views/ResetPassword.vue';
import VerifyEmail from './views/VerifyEmail.vue';

function resolveViewFromValue(value = ''):
DefineComponent<any, any, any, any, any, any, any, any, any, any>{
  const route = useRoute()
  if (route.matched.length > 0) {
    return RouterView
  }
  switch (value.toLowerCase()){
    case 'login':
    case 'signin':
      return Login;
    case 'register':
    case 'signup':
      return Register;
    case 'mfa':
    case 'challenge':
    case 'mfa-challenge':
      return Challenge;
    case 'email':
    case 'mfa-email':
      return Email;
    case 'sms':
    case 'mfa-sms':
      return SMS;
    case 'otp':
    case 'mfa-otp':
      return OTP;
    case 'fv':
    case 'mfa-fv':
      return FingerVein;
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
      function onResize() {
        isMobile.value = window.innerWidth < 600
      }
      onResize()
      window.addEventListener('resize', onResize, { passive: true })

      onBeforeUnmount(() => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', onResize)
        }
      })

      return {
        isMobile
      }
    },
    render(){
      const resolvedView = resolveViewFromValue(settings.mode)
      return h(
        'div',
        {
          class: 'pa__widget',
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
                  resolvedView,
                  resolvedView === RouterView ? {} :
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

