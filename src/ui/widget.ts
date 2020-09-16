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
    return h(RouterView)
  }
  switch (value.toLowerCase()){
    case 'login':
    case 'signin':
      return h(Login);
    case 'register':
    case 'signup':
      return h(Register);
    case 'mfa':
    case 'challenge':
      return h(Challenge);
    case 'verifyemail':
      return h(Login);
    case 'consent':
      return h(Consent);
    case 'recovery':
      return h(ForgotPassword);
    case 'resetpassword':
      return h(ResetPassword);
    case 'fillmissing':
      return h(FillMissing);
    default:
      return h(RouterView)
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
        class: 'pa__widget container fill-height',
        style: {
          alignItems: 'center',
          justifyContent: 'center',
        }
      },[
        h('div', {
          class: ['row', 'justify-center'],
        },
        h('div', {
          class: {
            'pa-8': !this.isMobile,
            'pa-4': this.isMobile,
            col: true,
            'col-sm-12': true,
            'col-md-6': true,
            'col-lg-4': true,
            'col-12': true,
            'elevation-1': !this.isMobile
          }
        }, resolveViewFromValue(settings.mode)))
      ])
    }
  });
}

