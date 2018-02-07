<template>
    <div id='shop_button'>
        <transition name='roll'>
            <div class='button-decrease' v-show='foods.count > 0' @click.stop.prevent='decreaseFoods'>
                <i class='icon-remove_circle_outline'></i>
            </div>
        </transition>
        <div class='button-count' v-show='foods.count > 0'>{{foods.count}}</div>
        <div class='button-add icon-add_circle' @click.stop.prevent='addFoods($event)'></div>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        props: ['foods'],
        methods: {
            addFoods(e) {
                this.$emit('add', e.target)   // 向父组件发射数据 会触发父组件中 自定义事件add
                if (!this.foods.count) {
                    Vue.set(this.foods, 'count', 1)
                } else {
                    this.foods.count ++
                }
            },
            decreaseFoods() {
                if (this.foods.count) {
                    this.foods.count --
                }
            }
        }
    }
</script>

<style lang='less'>
    @import '../../common/less/icon.less';

    #shop_button {
        font-size: 0;
        .button-decrease,
        .button-add {
            display: inline-block;
            padding: 0.375rem;
            font-size: 1.5rem;
            line-height: 1.5rem;
            color: rgb(0,160,220);
        }
        .button-decrease {
            &.roll-enter-active,
            &.roll-leave-active {
                transition: all 0.4s linear;
            }
            &.roll-enter,
            &.roll-leave-active {
                opacity: 0;
                transition: translate3d(24px,0,0);
                transform: rotate(180deg);
            }
            &.roll-enter-to {
                opacity: 1;
                transition: translate3d(0,0,0);
                transform: rotate(0);
            }
        }
        .button-count {
            display: inline-block;
            font-size: 0.625rem;
            line-height: 2.375rem;
            vertical-align: top;
            color: rgb(147,153,159);
        }
    }
</style>

