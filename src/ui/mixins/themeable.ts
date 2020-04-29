import { ComponentOptions } from 'vue';

export const Themeable: ComponentOptions = {
  inject: ['theme'],
  computed: {
    isDark(){
      return this.theme.dark
    }
  }
}
