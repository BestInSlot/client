<template>
<div class="avatar-lg">
   <img :src="previewImage" v-if="avatar">
   <template v-if="isInitial">
      <span class="set">
        <i class="fa fa-image"></i>
          <input type="file" 
          name="uploadAvatar"  
          @change="setImage($event.target.name, $event.target.files)"
          accept="image/"
          class="upload-avatar">
      </span>
    </template>
    <template v-if="isSet">
      <button class="upload" @click.prevent="upload" alt="upload">
        <i class="fa fa-upload"></i> 
      </button>
      <button class="remove" @click.prevent="reset" alt="reset">
        <i class="fa fa-remove"></i>
      </button>  
    </template>  
</div>
</template>

<script>
const STATUS = {
  INITIAL: 0,
  SET: 1,
  SAVING: 2,
  SUCCESS: 3,
  FAILED: 4
};

export default {
  data() {
    return {
      currentStatus: STATUS.INITIAL,
      uploadFieldName: "avatar",
      img: null,

      toastOptions: {
        theme: "primary",
        icon: "exclamation-triangle",
        duration: 3000,
        className: ["bis-notification", "danger"]
      }
    };
  },

  beforeDestroy() {
    this.reset();
  },

  computed: {
    avatar() {
      return this.$auth.user().avatar;
    },
    isInitial() {
      return this.currentStatus === STATUS.INITIAL;
    },
    isSet() {
      return this.currentStatus === STATUS.SET;
    },
    isSaving() {
      return this.currentStatus === STATUS.SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS.SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS.FAILED;
    },
    previewImage() {
      return this.isSet
        ? this.img.src
        : this.avatar
          ? `http://localhost${this.avatar}`
          : "https://bulma.io/images/placeholders/96x96.png";
    }
  },

  methods: {
    reset() {
      this.img = null;
      this.currentStatus = STATUS.INITIAL;
    },

    setImage(name, files) {
      if (!files[0]) {
        return;
      }

      if (!/\.(jpe?g|png|svg)/i.test(files[0].name)) {
        const message = "Invalid Image Format.";
        this.$toasted.show(message, this.toastOptions);
        return;
      }

      this.img = {};
      this.img.name = files[0].name;

      const reader = new FileReader();

      reader.addEventListener("load", () => {
        this.img.src = reader.result;
        this.currentStatus = STATUS.SET;
        console.log(this.img.src);
      });

      reader.readAsDataURL(files[0]);
    },

    toBlob(dataURI) {
      let byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0) {
        byteString = atob(dataURI.split(",")[1]);
      } else {
        byteString = unescape(dataURI.split(",")[1]);
      }

      let mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      let ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], { type: mimeString });
    },

    async upload() {
      this.currentStatus = STATUS.SAVING;
      let formData = new FormData();
      let file = this.toBlob(this.img.src);

      if (!file) return;

      formData.append(this.uploadFieldName, file, this.img.name);

      try {
        const {data} = await this.$http.put("/users/update/avatar", formData);
        const message = "Changes saved.";
        this.$auth.user().avatar = data.user.avatar
        this.toastOptions.icon = "check";
        this.toastOptions.className[1] = "success";
        this.$toasted.show(message, this.toastOptions);
      } catch (e) {
        this.toastOptions.icon = "exclamation-triangle";
        this.toastOptions.className[1] = "warning";
        if (e.response) {
          const message = e.response.data.message;
          this.$toasted.show(message, this.toastOptions);
        } else if (e.request) {
          const message = e.request.message;
          this.$toasted.show(message, this.toastOptions);
        } else {
          console.log(e);
        }
      }
      this.reset();
    }
  }
};
</script>


<style lang="scss">
$avatar-button-dimensions: 30px;
#avatar {
  position: relative;
  img {
    border-radius: 50%;
  }

 
}
</style>
