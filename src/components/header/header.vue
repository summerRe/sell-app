<template>
    <div id='header'>
        <!-- 商家信息 -->
        <div class="seller-wrap">
            <!-- 商家头像 -->
            <div class="seller-avatar">
                <img :src="seller.avatar" alt="">
            </div>
            <!-- 信息 -->
            <div class="seller-info">
                <div class="seller-info-title">
                    <span class='seller-info-title-brand'></span>
                    <span class='seller-info-title-content'>{{seller.name}}</span>
                </div>
                <div class="seller-info-convey">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
                <div class="seller-info-activity" v-if='seller.supports'>
                    <span class='seller-info-activity-icon' :class='description[seller.supports[0].type]'></span>
                    <span class='seller-info-activity-description'>{{seller.supports[0].description}}</span>
                </div>
            </div>
             <!-- 更多优惠按钮 -->
            <div class='seller-info-more' v-if='seller.supports' @click='showDetail'>
                <span class='seller-info-more-text'>5个</span>
                <i class='icon-keyboard_arrow_right'></i>
            </div>
        </div>
        <!-- 公告 -->
        <div class="bulletin-wrap" @click='showDetail'>
            <span class='bulletin-brand'></span>
            <span class='bulletin-content'>{{seller.bulletin}}</span>
            <i class='icon-keyboard_arrow_right'></i>
        </div>
        <!-- 背景 -->
        <div class='background'>
            <img :src="seller.avatar" alt="">
        </div>
        <!-- 弹出层详情页 -->
        <transition name='fade'>
            <div class='details' v-show='showDetails'>
                <div class='details-wrap clearfix'>
                    <div class='details-content'>
                        <!-- 弹出层商家标题 -->
                        <h2 class='details-content-title'>{{seller.name}}</h2>
                        <!-- 星星评级 -->
                        <div class='details-content-star-wrap'>
                            <v-star :size='48' :score='seller.score'></v-star>
                        </div>
                        <!-- 优惠活动部分 -->
                        <div class='details-content-activities act-bulle'>
                            <div class='activities-title act-bulle-common'>
                                <div class='line'></div>
                                <h3 class='title'>优惠信息</h3>
                                <div class='line'></div>
                            </div>
                            <ul class='activities-list' v-if='seller.supports'>
                                <li class='list-wrap' v-for='(value, index) in description' :key='index'>
                                    <span class='list-brand' :class='value'></span>
                                    <span class='list-text'>{{seller.supports[index].description}}</span>
                                </li>
                            </ul>
                        </div>
                        <!-- 公告部分 -->
                        <div class='details-content-bulletin act-bulle'>
                            <div class='bulletin-title act-bulle-common'>
                                <div class='line'></div>
                                <h3 class='title'>商家公告</h3>
                                <div class='line'></div>
                            </div>
                            <div class='bulletin-content'>
                                <p class='bulletin-text'>{{seller.bulletin}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 弹出层关闭按钮 -->
                <div class='details-close' @click='hideDetail'>
                    <i class='icon-close'></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import stars from '../stars/stars'

    export default {
        props: ['seller'],
        data() {
            return {
                description: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
                showDetails: false
            }
        },
        components: {
            'v-star': stars
        },
        methods: {
            showDetail() {
                this.showDetails = true
            },
            hideDetail() {
                this.showDetails = false
            }
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/mixin.less';
    @import '../../common/less/icon.less';

    #header {
        position: relative;
        color: rgb(255,255,255);
        background: rgba(7,17,27,0.5);
        overflow: hidden;
        .seller-wrap {
            position: relative;
            font-size: 0;
            padding: 1.5rem 0 1.125rem 1.5rem;
            .seller-avatar {
                display: inline-block;
                vertical-align: top;
                img {
                    width: 4rem;
                    height: 4rem;
                    border-radius: 0.125rem;
                }
            }
            .seller-info {
                display: inline-block;
                margin-left: 1rem;
                .seller-info-title {
                    margin: 0.125rem 0 0.5rem;
                    .seller-info-title-brand {
                        display: inline-block;
                        width: 1.875rem;
                        height: 1.125rem;
                        vertical-align: top;
                        .bg-img(brand);
                        background-repeat: no-repeat;
                        background-size: 1.875rem 1.125rem;
                    }
                    .seller-info-title-content {
                        line-height: 1.125rem;
                        font-size: 1rem;
                        font-weight: bold;
                        margin-left: 0.375rem;
                    }
                }
                .seller-info-convey {
                    font-size: 0.75rem;
                    margin-bottom: 0.625rem;
                }
                .seller-info-activity {
                    .seller-info-activity-icon {
                        display: inline-block;
                        width: 0.75rem;
                        height: 0.75rem;
                        background-repeat: no-repeat;
                        background-size: 0.75rem 0.75rem;
                        vertical-align: top;
                        &.decrease {
                            .bg-img(decrease_1);
                        }
                        &.discount {
                            .bg-img(discount_1);
                        }
                        &.special {
                            .bg-img(special_1);
                        }
                        &.invoice {
                            .bg-img(invoice_1);
                        }
                        &.guarantee {
                            .bg-img(guarantee_1);
                        }
                    }
                    .seller-info-activity-description {
                        font-size: 0.625rem;
                        font-weight: 200;
                        line-height: 0.75rem;
                        vertical-align: top;
                        margin-left: 0.25rem;
                    }
                }
            }
            .seller-info-more {
                position: absolute;
                bottom: 0.625rem;
                right: 0.75rem;
                padding: 0 0.5rem;
                height: 1.5rem;
                background-color: rgba(0,0,0,0.2);
                border-radius: 1.25rem;
                font-size: 0;
                text-align: center;
                line-height: 1.5rem;
                .seller-info-more-text {
                    font-size: 0.625rem;
                    font-weight: 200;
                }
                .icon-keyboard_arrow_right {
                    font-size: 0.625rem;
                    margin-left: 0.125rem;
                }
            }
        }
        .bulletin-wrap {
            position: relative;
            height: 1.75rem;
            line-height: 1.75rem;
            white-space: nowrap;   /*省略号实现 3步*/
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 1.625rem 0 0.75rem;
            background-color: rgba(7,17,27,0.2);
            .bulletin-brand {
                display: inline-block;
                width: 1.375rem;
                height: 0.75rem;
                .bg-img(bulletin);
                background-repeat: no-repeat;
                background-size: 1.375rem 0.75rem;
            }
            .bulletin-content {
                font-size: 0.625rem;
                font-weight: 200;
                vertical-align: top;
            }
            .icon-keyboard_arrow_right {
                position: absolute;
                right: 0.75rem;
                top: 50%;
                margin-top: -0.3125rem;
                font-size: 0.625rem;
            }
        }
        .background {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            filter: blur(0.625rem);
            img {
                width: 100%;
                height: 100%;
            }
        }
        .details {
            position: fixed;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(7,17,27,0.8);
            overflow: auto;
            z-index: 999;
            backdrop-filter: blur(10px);
            .details-wrap {
                min-height: 100%;
                .details-content {
                    margin-top: 4rem;
                    padding-bottom: 4rem;
                    .details-content-title {
                        text-align: center;
                        font-size: 1rem;
                        font-weight: 700;
                    }
                    .details-content-star-wrap {
                        width: 12.75rem;
                        margin: 1rem auto 0;
                    }
                    .act-bulle {
                        .act-bulle-common {
                            display: flex;
                            align-items: center;
                            width: 80%;
                            margin: 1.75rem auto 1.5rem;
                            .line {
                                flex: 1;
                                height: 1px;
                                background-color: rgba(255,255,255,0.2);
                            }
                            .title {
                                padding: 0 0.75rem;
                                font-size: 0.875rem;
                                font-weight: 700;
                            }
                        }
                    }
                    .details-content-activities {
                        .activities-list {
                            width: 80%;
                            margin: 0 auto;
                            .list-wrap {
                                margin-bottom: 0.75rem;
                                &:last-child {
                                    margin-bottom: 0;
                                }
                                .list-brand {
                                    display: inline-block;
                                    width: 1rem;
                                    height: 1rem;
                                    background-repeat: no-repeat;
                                    background-size: 1rem 1rem;
                                    margin-right: 0.375rem;
                                }
                                .decrease {
                                    .bg-img(decrease_2);
                                }
                                .discount {
                                    .bg-img(discount_2);
                                }
                                .special {
                                    .bg-img(special_2);
                                }
                                .invoice {
                                    .bg-img(invoice_2);
                                }
                                .guarantee {
                                    .bg-img(guarantee_2);
                                }
                                .list-text {
                                    display: inline-block;
                                    height: 1rem;
                                    line-height: 1rem;
                                    vertical-align: top;
                                    font-size: 0.75rem;
                                    font-weight: 200;
                                }
                            }
                        }
                    }
                    .details-content-bulletin {
                        .bulletin-content {
                            width: 80%;
                            margin: 0 auto;
                            .bulletin-text {
                                font-size: 0.75rem;
                                font-weight: 200;
                                line-height: 1.5rem;
                                padding: 0 0.75rem;
                            }
                        }
                    }
                }
            }
            .details-close {
                position: relative;
                width: 2rem;
                height: 2rem;
                margin: -4rem auto 0;
                font-size: 2rem;
                color: rgba(255,255,255,0.5);
                clear: both;
            }
        }
        .fade-enter-active,
        .fade-leave-active {
            transition: 0.5s all ease-in;
        }
        .fade-enter,
        .fade-leave-to {
            opacity: 0;
            background: rgba(7,17,27,0);
        }
        .fade-enter-to {
            opacity: 1;
            background: rgba(7,17,27,0.5);
        }
    }
</style>


