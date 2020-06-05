import { App } from 'vue';

import PasswordStrength from './PasswordStrength';
import PButton from './PBtn';
import PForm from './PForm';
import PLoading from './PLoading';
import PMessage from './PMessage';
import PTextField from './PTextField';

export {
  PButton,
  PForm,
  PLoading,
  PMessage,
  PTextField,
  PasswordStrength
}

export function installComponents(Vue: App<Element>): void{
  Vue.component(PButton.name, PButton)
    .component(PForm.name, PForm)
    .component(PLoading.name, PLoading)
    .component(PMessage.name, PMessage)
    .component(PTextField.name, PTextField)
}
