<template>
    <div class="applicant" @click="view">
         <span class="icon is-large">
            <img :src="`http://localhost${applicant.avatar}`" alt="">
         </span>
        <span class="user">{{applicant.username}}</span>
        <span class="date">{{date}}</span>
        <span class="actions buttons">
            <button class="button is-success is-small" @click.stop="">Accept</button>
            <button class="button is-danger is-small" @click.stop="">Decline</button>
        </span>
    </div>
</template>


<script>
import {formatDate} from "../../../helpers";
export default {
    props: {
        applicant: {
            type: Object,
            required: true
        },
        created_at: {
            type: String,
            required: true
        },
        id: {
            type: String,
            requred: true
        }
    },
    computed: {
        date() {
            return formatDate(this.created_at, "dddd, MMM, Do, YYYY");
        },
    },
    methods: {
        view() {
            this.$store.dispatch("recruitment/setContent", this.id)
        }
    }
}
</script>

<style lang="scss">
.applicant {
  display: flex;
  padding: 0.5rem;
  background-color: #0f0f0f;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  .user, .date {
      flex: 1;
      padding: 0 1rem;
  }
  .user {
      padding: 0 1rem;
  }
  &:not(:last-child) {
      margin-bottom: 1px;
  }
  .actions {
      position: relative;
      z-index: 100;
  }
}
</style>
