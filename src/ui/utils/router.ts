import { createRouter, createWebHistory } from 'vue-router';

import Consent from '../views/Consent.vue';
import FillMissing from '../views/FillMissing.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ResetPassword from '../views/ResetPassword.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/signin',
      // @ts-ignore
      component: Login,
    },
    {
      path: '/signup',
      // @ts-ignore
      component: Register
    },
    {
      path: '/signin/recovery',
      // @ts-ignore
      component: ForgotPassword
    },
    {
      path: '/updateMissingInformation',
      // @ts-ignore
      component: FillMissing,
    },
    {
      path: '/signin/consent',
      // @ts-ignore
      component: Consent
    },
    {
      path: '/resetPassword/:token?',
      // @ts-ignore
      component: ResetPassword
    }
  ]
})
