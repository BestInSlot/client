<template>
    <section id="recruitment" class="section">
        <div class="container">
            <div class="columns is-multiline">
                <div class="column is-12">
                    <div class="head">
                        <div class="left">
                            <h4 class="subtitle is-4">Templates</h4>
                        </div>
                        <div class="right">
                            <button class="button is-info" @click="isActive = true">
                                <i class="fa fa-plus"></i>
                                <span>New Template</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <create :isActive.sync="isActive"></create>
    </section>
</template>

<script>
import Create from "./CreateApplication.1";
export default {
    components: { Create },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.dispatch("recruitment/fetchApplicationTemplates");
        })
    },
    data() {
        return {
            isActive: false
        }
    }
}
</script>
