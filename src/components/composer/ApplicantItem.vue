<template>
    <div class="applicant">
         <span class="icon is-large">
            <img :src="`http://localhost${applicant.avatar}`" alt="">
         </span>
        <span class="user">{{applicant.username}}</span>
        <span class="date">{{date}}</span>
        <span class="buttons">
            <button class="button is-info is-small">View</button>
            <button class="button is-success is-small">Accept</button>
            <button class="button is-danger is-small">Decline</button>
        </span>
    </div>
</template>


<script>
import format from "date-fns/format"
export default {
    props: {
        applicant: {
            type: Object,
            required: true
        },
        created_at: {
            type: String,
            required: true
        }
    },
    computed: {
        date() {
            return format(this.created_at, "dddd, MMM, Do, YYYY");
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
  }
  .user {
      padding: 0 1rem;
  }
}
</style>
