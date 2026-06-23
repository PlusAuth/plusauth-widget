import type { App } from 'vue';

import PAlert from './PAlert/PAlert.vue';
import PasswordStrength from './PasswordStrength/PasswordStrength.vue';
import PButton from './PBtn/PBtn.vue';
import PCheckBox from './PCheckBox/PCheckBox.vue';
import PCodeInput from './PCodeInput/PCodeInput.vue';
import PForm from './PForm.vue';
import PMessage from './PMessage/PMessage.vue';
import PSelect from './PSelect/PSelect.vue';
import PSpinner from './PSpinner/PSpinner.vue';
import PTextField from './PTextField/PTextField.vue';
import PTimer from './PTimer/PTimer.vue';

export {
  PAlert,
  PasswordStrength,
  PButton,
  PCheckBox,
  PCodeInput,
  PForm,
  PMessage,
  PSelect,
  PSpinner,
  PTextField,
  PTimer
}

export function installComponents(Vue: App<Element>): void{
  Vue.component('PAlert', PAlert)
    .component('PasswordStrength', PasswordStrength)
    .component('PBtn', PButton)
    .component('PCheckBox', PCheckBox)
    .component('PCodeInput', PCodeInput)
    .component('PForm', PForm)
    .component('PMessage', PMessage)
    .component('PSelect', PSelect)
    .component('PSpinner', PSpinner)
    .component('PTextField', PTextField)
    .component('PTimer', PTimer)
}
