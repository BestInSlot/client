<template>
    <div class="question">
        <div class="question-head">
            {{content.question}}
        </div>
        <div class="answer" @click="edit = !edit" @blur="edit = false">
            <p v-if="!edit">{{content.answer}}</p>
            <form-element
                v-else
                v-model="content.answer" 
                :type="content.type" 
                :selectOptions="content.selectOptions" 
                :selector.sync="selector" 
                :selectorId="index+1"></form-element>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: Object
        },
        selector: Number,
        selectorId: Number
    },

    data() {
        return {
            edit: false
        }
    }
}
</script>
