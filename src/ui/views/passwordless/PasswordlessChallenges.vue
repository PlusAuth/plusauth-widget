<script setup lang="ts">
import WidgetLayout from '../../components/WidgetLayout.vue';
import { useContext } from '../../composables';
import AccountKeyIcon from '../../icons/AccountKeyIcon.vue';
import MailSentIcon from '../../icons/MailSentIcon.vue';
import MessageIcon from '../../icons/MessageIcon.vue';
import NotificationAlertIcon from '../../icons/NotificationAlertIcon.vue';
import PasswordIcon from '../../icons/PasswordIcon.vue';

defineOptions({
  name: 'Challenge'
});

const context = useContext();

const icons = {
  pw: PasswordIcon,
  push: NotificationAlertIcon,
  sms: MessageIcon,
  email: MailSentIcon,
  webauthn: AccountKeyIcon
};

const challenges = [
  ...context.client.passwordless || [],
  {
    name: 'pw',
    branding: {
      display_name: 'common.usePassword'
    }
  }
];
</script>

<template>
  <WidgetLayout
    logo="images/icons/select.svg"
    title="passwordless.challenge.title"
  >
    <div class="pa__signin-challenges pa__passwordless-challenges">
      <a
        v-for="challenge in challenges"
        :key="challenge.name"
        :href="'signin/passwordless/' + challenge.name"
        class="pa__btn pa__btn--flat pa__btn--block pa__signin-challenge pa__passwordless-challenge"
        @click.stop=""
      >
        <div class="pa__passwordless-challenge__icon">
          <component :is="icons[challenge.name as keyof typeof icons]" />
        </div>

        <span v-t="'passwordless.' + challenge.name + '.choice'" />
      </a>
    </div>
  </WidgetLayout>
</template>

<style>
</style>