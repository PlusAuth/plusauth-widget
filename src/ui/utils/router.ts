import { defineComponent, h } from 'vue';
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  RouterView
} from 'vue-router';

import { IWidgetSettings } from '../interfaces';
import Consent from '../views/Consent.vue';
import FillMissing from '../views/FillMissing.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Login from '../views/Login.vue';
import Challenge from '../views/mfa/Challenge.vue';
import Email from '../views/mfa/Email.vue';
import FingerVein from '../views/mfa/FingerVein.vue';
import OTP from '../views/mfa/OTP.vue';
import SMS from '../views/mfa/SMS.vue';
import Register from '../views/Register.vue';
import ResetPassword from '../views/ResetPassword.vue';
import VerifyEmail from '../views/VerifyEmail.vue';

const PlainRouterView = defineComponent( {
  render(){
    return h(RouterView)
  }
})


export const router = (settings: Partial<IWidgetSettings>) => createRouter({
  history: location.origin !== 'null' ? createWebHistory() : createMemoryHistory('/'),
  routes: [
    {
      path: '/signin',
      component: PlainRouterView,
      children: [
        {
          path: '',
          component: Login,
          props: settings && settings.modeOptions && settings.modeOptions.login
        },
        {
          path: 'consent',
          component: Consent,
          props: settings && settings.modeOptions && settings.modeOptions.consent
        },
        {
          path: 'recovery',
          component: ForgotPassword,
          props: settings && settings.modeOptions && settings.modeOptions.recovery
        },
        {
          path: 'challenge',
          component: PlainRouterView,
          children: [
            {
              path: '',
              component: Challenge,
              props: settings && settings.modeOptions && settings.modeOptions.challenge
            },
            {
              path: 'sms',
              name: 'sms',
              component: SMS,
              props: settings && settings.modeOptions && settings.modeOptions.sms
            },
            {
              path: 'email',
              name: 'email',
              component: Email,
              props: settings && settings.modeOptions && settings.modeOptions.email
            },
            {
              path: 'otp',
              name: 'otp',
              component: OTP,
              props: settings && settings.modeOptions && settings.modeOptions.otp
            },
            {
              path: 'fv',
              name: 'fv',
              component: FingerVein,
              props: settings && settings.modeOptions && settings.modeOptions.fv
            }
          ]
        },
      ]
    },
    {
      path: '/signup',
      component: Register,
      props: settings && settings.modeOptions && settings.modeOptions.signup
    },
    {
      path: '/account/verifyEmail',
      component: VerifyEmail,
      props: settings && settings.modeOptions && settings.modeOptions.verifyEmail
    },
    {
      path: '/account/updateMissingInformation',
      component: FillMissing,
      props: settings && settings.modeOptions && settings.modeOptions.fillMissing
    },
    {
      path: '/account/resetPassword/:token?',
      component: ResetPassword,
      props: settings && settings.modeOptions && settings.modeOptions.resetPassword
    }
  ]
})
