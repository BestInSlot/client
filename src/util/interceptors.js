export default function execute() {
  this.$http.interceptors.response.use(
    response => {
      return response;
    },
    err => {
      if (err.status === 401 && err.config && !err.config_isRetryRequest) {
        console.log("logged out");
        this.$auth.logout();
      }
      return Promise.reject(err);
    }
  );
}
