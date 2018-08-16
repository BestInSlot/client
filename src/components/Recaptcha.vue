<template>
    <vue-recaptcha
    ref="recaptcha"      
    :sitekey="sitekey" 
    :theme="theme" 
    :badge="badge" 
    :type="type" 
    :size="size" 
    :tabindex="tabindex" 
    @verify="$emit('verify', $event)" 
    @expire="$emit('expire')">
        <slot></slot>
    </vue-recaptcha>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
export default {
    components: {
        VueRecaptcha
    },
    props: {
        sitekey: {
            type: String,
            required: true
        },
        theme: String,
        badge: String,
        type: String,
        size: String,
        tabindex: String
    },

    beforeDestroy() {
        this.$refs.recaptcha.reset();
    }
}
</script>
