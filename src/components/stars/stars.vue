<template>
    <div id='star' :class='starSize'>
        <span class='star-item' v-for='(value, index) in starClasses' :key='index' :class='value'></span>
    </div>
</template>

<script>
    const STAR_NUM = 5
    const STAR_ON = 'on'
    const STAR_HALF = 'half'
    const STAR_OFF = 'off'

    export default {
        props: ['score', 'size'],
        computed: {
            starSize() {
                return `star-${this.size}`
            },
            starClasses() {
                let result = []
                let score = Math.floor(this.score * 2) / 2
                let hasDecimal = score % 1 !== 0
                let integar = Math.floor(score)

                for (let i = 0; i < integar; i++) {
                    result.push(STAR_ON)
                }

                if (hasDecimal) {
                    result.push(STAR_HALF)
                }

                while (result.length < STAR_NUM) {
                    result.push(STAR_OFF)
                }
                return result
            }
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/mixin.less';

    .star-config(@width,@height,@marginR,@starSize-on,@starSize-half,@starSize-off) {
        .star-item {
            display: inline-block;
            width: @width;
            height: @height;
            margin-right: @marginR;
            background-repeat: no-repeat;
            background-size: @width @height;
            &:last-child {
                margin-right: 0;
            }
            &.on {
                .bg-img(@starSize-on);
            }
            &.half {
                .bg-img(@starSize-half);
            }
            &.off {
                .bg-img(@starSize-off);
            }
        }
    }
    .star-48 {
        .star-config(1.25rem, 1.25rem, 1.625rem, star48_on, star48_half, star48_off);
    }
    .star-36 {
        .star-config(0.9375rem, 0.9375rem, 0.375rem, star36_on, star36_half, star36_off);
    }
    .star-24 {
        .star-config(0.625rem, 0.625rem, 0.1875rem, star24_on, star24_half, star24_off);
    }

</style>
