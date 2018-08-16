<template>
    <div class="tools">
        <div :class="['dropdown is-hoverable', { 'is-right': isRight, 'is-up': isDropUp}]">
            <div class="dropdown-trigger">
                <i class="fa fa-ellipsis-h"></i>
            </div>
            <div class="dropdown-menu">
                <div class="dropdown-content">
                    <a href="" class="dropdown-item">
                        <i class="fa fa-map-pin"></i>
                        <span>Sticky</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="" class="dropdown-item">
                        <i class="fa fa-edit"></i>
                        <span>Edit</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="" class="dropdown-item">
                        <i class="fa fa-times"></i>
                        <span>Delete</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isRight: {
            type: Boolean,
            default: true
        },
        isDropUp: {
            type: Boolean,
            default: false
        }
    }
}
</script>
