<template>
  <TimelineMessage
    :class="$style.message"
    :current-user="currentUser"
    :message-creator="message.user"
    :timestamp="message.createdAt"
  >
    <template #heading>
      <span>{{ message.user.firstName }} {{ message.user.lastName }}</span>
    </template>
    <div :class="$style.card">
      <p :class="$style.comment">
        {{ message.comment }}
      </p>
    </div>
  </TimelineMessage>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { CommentMessage } from '@/models/groups/Message';
  import TimelineMessage from '@/components/groups/deal/TimelineMessage.vue';

  @Component({
    components: { TimelineMessage }
  })
  export default class CommentCard extends Vue {
    @Prop({
      type: CommentMessage,
      required: true
    })
    readonly message;

    @Prop({
      type: Object,
      required: true
    })
    readonly currentUser;
  }
</script>

<style lang="scss" module>
  @import 'utils';

  .card {
    padding: 12px 29px 12px 16px;
  }

  .message {
    padding-bottom: 16px;
  }

  .comment {
    line-height: 20px;
    word-break: break-word;
    white-space: pre-line;

    margin: 0;
  }
</style>
