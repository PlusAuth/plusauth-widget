import { defineComponent, h } from 'vue';
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
    render(){
      return h('div', {
        class: 'pa__widget row',
        style: {
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }
      },[
        h('div', {
          class: ['col', 'pa-8',
                  'col-sm-8', 'col-md-5', 'col-lg-4', 'col-12',
                  'elevation-1'
          ],
        }, resolveViewFromValue(settings.mode))
      ])
    }
  });
}

