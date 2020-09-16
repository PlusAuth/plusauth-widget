import { defineComponent, h, ref,onBeforeUnmount } from 'vue';
import './styles/main.sass'

import { RouterView, useRoute } from 'vue-router';

import { Theme } from './utils/theme';
import Consent from './views/Consent.vue';
import FillMissing from './views/FillMissing.vue';
import ForgotPassword from './views/ForgotPassword.vue';
import Login from './views/Login.vue';
import Challenge from './views/mfa/Challenge.vue';
import Register from './views/Register.vue';
import ResetPassword from './views/ResetPassword.vue';

function resolveViewFromValue(value = ''){
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
      return Challenge;
    case 'verifyemail':
      return Login;
    case 'consent':
      return Consent;
    case 'recovery':
      return ForgotPassword;
    case 'resetpassword':
      return ResetPassword;
    case 'fillmissing':
      return FillMissing;
    default:
      return RouterView
  }
}
export default function (theme: Theme, settings: any): any {
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
          // @ts-ignore
          window.removeEventListener('resize', onResize, { passive: true })
        }
      })

      return {
        isMobile
      }
    },
    render(){
      return h('div', {
        class: 'pa__widget pa__container pa__fill-height',
        style: {
          alignItems: 'center',
          justifyContent: 'center',
        }
      },[
        h('div', {
          class: ['pa__row', 'pa__justify-center'],
        },
        h('div', {
          class: {
            'pa__pa-8': !this.isMobile,
            'pa__pa-4': this.isMobile,
            'pa__col': true,
            'pa__col-sm-12': true,
            'pa__col-md-6': true,
            'pa__col-lg-4': true,
            'pa__col-12': true,
            'pa__elevation-1': !this.isMobile
          }
        }, h(resolveViewFromValue(settings.mode) as any)))
      ])
    }
  });
}

