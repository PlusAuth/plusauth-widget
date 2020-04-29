import deepmerge from 'deepmerge';
import PlusAuth from 'plusauth-js';
import { App } from 'vue';

import { createWidget } from './ui';
import { IPlusAuthContext, IWidgetSettings } from './ui/interfaces';
// @ts-ignore
import css from './ui/styles/main.sass'

export default class PlusAuthWidget {
  private _view: App<Element>;
  private api: PlusAuth;

  constructor(container: Element | string,
    settings: Partial<IWidgetSettings> = {},
    context: Partial<IPlusAuthContext>) {
    this.api = new PlusAuth(settings.apiUrl || window.location.origin)
    this._view = createWidget(container, deepmerge(settings, {
      locale: {
        defaultLocale: 'en',
        dictionary: {
          en: {
            login: {
              username: 'Username',
              password: 'Password',
              forgotPassword: 'Forgot Password',
              signIn: 'Sign In',
              signUp: 'Sign Up'
            },
            register: {
              username: 'Username',
              password: 'Password',
              repassword: 'Confirm Password',
              signIn: 'Sign In',
              signUp: 'signUp'
            }
          }
        }
      }
    }), context)
    this._view.provide('api', this.api)
  }
  get view(): IWidgetSettings {
    return this._view.config.globalProperties.settings;
  }
}
