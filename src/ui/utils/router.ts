import { defineComponent, h } from 'vue';
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  RouterView
} from 'vue-router';

import Consent from '../views/Consent.vue';
import FillMissing from '../views/FillMissing.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Login from '../views/Login.vue';
import Challenge from '../views/mfa/Challenge.vue';
import Email from '../views/mfa/Email.vue';
import OTP from '../views/mfa/OTP.vue';
import SMS from '../views/mfa/SMS.vue';
import Register from '../views/Register.vue';
import ResetPassword from '../views/ResetPassword.vue';

const PlainRouterView = defineComponent( {
  render(){
    return h(RouterView)
  }
})


export const router = createRouter({
  history: location.origin !== 'null' ? createWebHistory() : createMemoryHistory('/'),
  routes: [
    {
      path: '/signin',
      component: PlainRouterView,
      children: [
        {
          path: '',
          component: Login
        },
        {
          path: 'consent',
          component: Consent
        },
        {
          path: 'recovery',
          component: ForgotPassword
        },
        {
          path: 'challenge',
          component: PlainRouterView,
          children: [
            {
              path: '',
              component: Challenge
            },
            {
              path: 'sms',
              name: 'sms',
              component: SMS,
            },
            {
              path: 'email',
              name: 'email',
              component: Email
            },
            {
              path: 'otp',
              name: 'otp',
              component: OTP,
              props: settings && settings.modeOptions && settings.modeOptions.otp
            }
          ]
        },
      ]
    },
    {
      path: '/signup',
      component: Register
    },
    {
      path: '/updateMissingInformation',
      component: FillMissing,
    },
    {
      path: '/resetPassword/:token?',
      component: ResetPassword
    }
  ]
})
