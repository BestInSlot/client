<template>
    <section class="section" id="account">
        <div class="container">
            <div class="account-header">
                <h4 class="subtitle">{{title}}</h4>
            </div>
            <div class="content">
                <p>We've authenticated your request and an email has been dispatched with your new credentials.</p>
            </div>
        </div>
    </section>
</template>

<script>
import {put} from "axios";
export default {
    props: {
        title: {
            type: String
        }
    },

    async beforeRouteEnter(to, from, next) {
        try {
            next(vm => {
                const params = vm.$auth.check()? to.params : to.query;
                await put('/users/update/security', { ...params });
            });
        } catch (err) {
            if (err.response) {
                to.push("/error/"+err.response.status);
            }
        }
    }
}
</script>

