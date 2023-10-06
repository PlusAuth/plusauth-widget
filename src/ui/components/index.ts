import { App } from 'vue';

import PAlert from './PAlert';
import PasswordStrength from './PasswordStrength';
import PButton from './PBtn';
import PCheckBox from './PCheckBox';
import PForm from './PForm';
import PIcon from './PIcon';
import PLoading from './PLoading';
import PMessage from './PMessage';
import PSelect from './PSelect';
import PTextField from './PTextField';

export {
  PAlert,
  PButton,
  PCheckBox,
  PForm,
  PIcon,
  PLoading,
  PMessage,
  PTextField,
  PSelect,
  PasswordStrength
}

export function installComponents(Vue: App<Element>): void{
  Vue.component(PAlert.name, PAlert)
    .component(PButton.name, PButton)
    .component(PForm.name, PForm)
    .component(PIcon.name, PIcon)
    .component(PLoading.name, PLoading)
    .component(PMessage.name, PMessage)
    .component(PSelect.name, PSelect)
    .component(PTextField.name, PTextField)
}
