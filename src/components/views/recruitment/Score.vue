<template>
    <div class="score">
        <span class="up" @click="increment"></span>
        <span class="down" @click="decrement"></span>
        {{vote}}
    </div>
</template>

<script>
export default {
    data() {
        return {
            vote: 0
        }
    },
    methods: {
        increment() {
            if (this.vote < 1) return;
            this.vote++;
        },
        decrement() {
            if (this.vote > -1) return;
            this.vote--;
        }
    }
}
</script>


<style>

</style>
