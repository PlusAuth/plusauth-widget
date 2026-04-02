<template>
  <WidgetLayout
    logo="images/icons/select.svg"
    title="passwordless.challenge.title"
  >
    <div class="pa__signin-challenges pa__passwordless-challenges">
      <a
        v-for="challenge in challenges"
        :key="challenge"
        :href="'signin/passwordless/'+ challenge.name"
        class="pa__btn pa__btn--flat pa__btn--block pa__signin-challenge pa__passwordless-challenge"
        @click.stop=""
      >
        <div class="pa__passwordless-challenge__icon">
          <component :is="icons[challenge.name]" />
        </div>

        <span v-t="'passwordless.'+ challenge.name + '.choice'" />
      </a>
    </div>
  </WidgetLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext } from '../../composables';
import AccountKeyIcon from '../../icons/AccountKeyIcon.vue';
import MailSentIcon from '../../icons/MailSentIcon.vue';
import MessageIcon from '../../icons/MessageIcon.vue';
import NotificationAlertIcon from '../../icons/NotificationAlertIcon.vue';
import PasswordIcon from '../../icons/PasswordIcon.vue';

export default defineComponent({
  name: 'Challenge',
  components: { WidgetLayout },
  props: {},
  setup() {
    const icons = {
      pw: PasswordIcon,
      push: NotificationAlertIcon,
      sms: MessageIcon,
      email: MailSentIcon,
      webauthn: AccountKeyIcon
    }
    const context = useContext()
    const challenges = [
      ...context.client.passwordless,
      {
        name: 'pw',
        branding: {
          display_name: 'common.usePassword'
        }
      }
    ]
    return {
      icons,
      challenges,
      context
    }
  }
})
</script>

<style>
</style>
