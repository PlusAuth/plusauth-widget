import { App } from 'vue';

import PasswordStrength from './PasswordStrength';
import PButton from './PBtn';
import PCheckBox from './PCheckBox';
import PForm from './PForm';
import PLoading from './PLoading';
import PMessage from './PMessage';
import PSelect from './PSelect';
import PTextField from './PTextField';

export {
  PButton,
  PCheckBox,
  PForm,
  PLoading,
  PMessage,
  PTextField,
  PSelect,
  PasswordStrength
}

export function installComponents(Vue: App<Element>): void{
  Vue.component(PButton.name, PButton)
    .component(PForm.name, PForm)
    .component(PSelect.name, PSelect)
    .component(PLoading.name, PLoading)
    .component(PMessage.name, PMessage)
    .component(PTextField.name, PTextField)
}
