import { defineComponent, h, VNode, ComponentOptions } from 'vue';
import './styles/main.sass'

import { View } from 'vue-router';

import { Theme } from './utils/theme';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

export default function (theme: Theme): any {
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
                  'col-sm-6', 'col-md-5', 'col-lg-3', 'col-12',
                  'elevation-1'
          ],
        }, h(View))
      ])
    }
  });
}

