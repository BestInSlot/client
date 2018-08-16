<template>
  <div class="container">
    <section id="error-status">
      <div class="columns is-gapless is-multiline has-text-centered">
        <div class="error-icon column is-12">
          <i :class="errorClasses" aria-hidden="true"></i>
        </div>
        <div class="column is-12">
          <div class="content">
            <h1 class="is-size-4-mobile">{{errorStatus.code}}</h1>
            <h2 class="is-size-4-mobile">{{errorStatus.type}}</h2>
            <h3 class="is-size-4-mobile">{{errorStatus.message}}</h3>
          </div>
        </div>
        <div class="column is-12">
          <button class="button is-danger" @click.prevent="$router.push({name: 'home'})">Return to Home</button>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
const error = {
  "500": {
    code: 500,
    class: "fa-exclamation-triangle",
    type: "Internal Server Error",
    message: "We encountered an error and the service is trying to recover."
  },
  "422": {
    code: 422,
    class: "fa-question-circle",
    type: "Bad Request",
    message: "Request was malformed."
  },
  "404": {
    code: 404,
    class: "fa-question-circle",
    type: "Not Found",
    message: "The content you're looking for doesn't exist."
  },
  "403": {
    code: 403,
    class: "fa-ban",
    type: "Forbidden",
    message: "You have no access privilages."
  },
  "401": {
    code: 401,
    class: "fa-ban",
    type: "Unauthorized",
    message: "You are not authorized to view this content."
  }
};

export default {
  name: "error-handler",
  beforeRouteEnter(to, from, next) {
    const incomingErrorCode = to.params.status;
    const validError = Object.keys(error).find(
      err => err === incomingErrorCode
    );
    if (!validError) {
      next("/");
    } else {
      next();
    }
  },

  props: ["status"],

  data() {
    return {
      error
    };
  },

  computed: {
    errorClasses() {
      return ["fa", this.errorStatus.class];
    },
    errorStatus() {
      return this.error[this.status];
    }
  }
};
</script>


<style lang="scss">
#error-status {
  margin-top: 5rem;
  padding: 1.5rem 0;
  background-color: #111;
  min-width: 100%;
  min-height: 30rem;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  h1,
  h2 {
    margin: 0;
    padding: 0;
    font-weight: 700;
  }
  .error-icon {
    font-size: 8rem;
  }
  .error-icon {
    color: #cacaca;
  }
}
</style>
