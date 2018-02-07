<template>
    <div id='rate_type'>
        <div class='sel-type border-1px'>
            <span class='block sel-type-total' @click='sel(2)' :class='{"active": typeMark === 2}'>{{selType.all}}
                <span class='sel-type-count'>{{ratings.length}}</span>
            </span>
            <span class='block sel-type-positive' @click='sel(0)' :class='{"active": typeMark === 0}'>{{selType.positive}}
                <span class='sel-type-count'>{{posi.length}}</span>
            </span>
            <span class='block sel-type-negative' @click='sel(1)' :class='{"active": typeMark === 1}'>{{selType.negative}}
                <span class='sel-type-count'>{{nega.length}}</span>
            </span>
        </div>
        <div class='only-content' @click='toggleContent'>
            <i class='icon-check_circle' :class='{"check-on": onlyContent.content}'></i>
            <span class='only-content-text'>只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
    const TOTAL = 2
    const POSITIVE = 0
    const NEGATIVE = 1

    export default {
        props: {
            'selType': {
                type: Object
            },
            'ratings': {
                type: Array,   // 传过来如果是数组必须得return []
                default() {
                    return []
                }
            },
            'onlyContent': {
                type: Object
            }
        },
        data() {
            return {
                typeMark: TOTAL
            }
        },
        computed: {
            posi() {
                return this.ratings.filter((v) => {
                    return v.rateType === POSITIVE
                })
            },
            nega() {
                return this.ratings.filter((v) => {
                    return v.rateType === NEGATIVE
                })
            }
        },
        methods: {
            sel(mark) {
                this.typeMark = mark
                this.$emit('marks', mark)
            },
            toggleContent() {
                this.onlyContent.content = !this.onlyContent.content
                this.$emit('hadContent', this.onlyContent.content)
            }
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/icon.less';
    @import '../../common/less/mixin.less';
    @import '../../common/less/scale.less';

    #rate_type {
        .sel-type {
            padding: 1.125rem 0;
            margin: 0 1.125rem;
            font-size: 0;
            .border-1px(rgba(7,17,27,0.1));
            .block {
                display: inline-block;
                margin-right: 0.5rem;
                padding: 0.5rem 0.75rem;
                border-radius: 2px;
                font-size: 0.75rem;
                &.sel-type-total {
                    background-color: rgba(0,160,220,0.2);
                    &.active {
                        background-color: rgb(0,160,220);
                        color: #fff;
                    }
                }
                &.sel-type-positive {
                    background-color: rgba(0,160,220,0.2);
                    &.active {
                        background-color: rgb(0,160,220);
                        color: #fff;
                    }
                } 
                &.sel-type-negative {
                    background-color: rgba(77,85,93,0.2);
                    &.active {
                        background-color: rgb(77,85,93);
                        color: #fff;
                    }
                }
                .sel-type-count {
                    font-size: 0.5rem;
                }
            }
        }
        .only-content {
            padding: 0.75rem 1.125rem;
            border-bottom: 1px solid rgba(7,17,27,0.1);
            font-size: 0;
            color: rgb(147,153,159);
            .icon-check_circle {
                display: inline-block;
                margin-right: 0.25rem;
                font-size: 1.5rem;
                line-height: 1.5rem;
                &.check-on {
                    color: #00c850;
                }
            }
            .only-content-text {
                display: inline-block;
                vertical-align: top;
                line-height: 1.5rem;
                font-size: 0.75rem;
            }
        }
    }
</style>
