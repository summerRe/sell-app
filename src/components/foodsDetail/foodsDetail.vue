<template>
    <transition name='fade'>
        <div id='foods_detail' v-show='showFlag'  ref='innerScroll'>
            <div class='foods_detail-content-wrap'>
                <!-- 顶部图片 -->
                <div class='foods_detail-img'>
                    <img :src='foodDet.image' alt=''>
                    <i class='icon-arrow_lift' @click='hide'></i>
                </div>
                <!-- 图片下内容 -->
                <div class='foods_detail-content'>
                    <!-- 食物价格销量相关 -->
                    <div class='content-header'>
                        <h2 class='content-header-title'>{{foodDet.name}}</h2>
                        <div class='content-header-sales'>
                            <span class='sales-count'>月售{{foodDet.sellCount}}份</span><span>好评率{{foodDet.rating}}%</span>
                        </div>
                        <div class='content-header-price'>
                            <span class='now-price'>￥{{foodDet.price}}</span><span class='old-price' v-show='foodDet.oldPrice'>￥{{foodDet.oldPrice}}</span>
                        </div>
                        <div class='shopButton-wrap'>
                            <v-shopButton :foods='foodDet' @add='addFood'></v-shopButton>
                        </div>
                        <transition name='fade'>
                            <div class='add_shop_cart' v-show='!foodDet.count' @click='addFirst($event)'>加入购物车</div>
                        </transition>    
                    </div>
                    <v-partition></v-partition>
                    <!-- 食物介绍 -->
                    <div class='content-intro' v-show='foodDet.info'>
                        <h2 class='intro-title'>商品介绍</h2>
                        <p class='intro-text'>{{foodDet.info}}</p>
                    </div>
                    <v-partition v-show='foodDet.info'></v-partition>
                    <!-- 食物评价 -->
                    <div class='content-rate' v-if='foodDet.ratings'>
                        <h2 class='rate-title'>商品评价</h2>
                        <v-rateType :selType='selectType' :ratings='foodDet.ratings'     :onlyContent='onlyContent' @hadContent='onlyContents' @marks='getMark'></v-rateType>
                        <div class='rate-no_ratings' v-show='foodDet.ratings.length === 0'>暂无评价！</div>
                        <ul class='rate-detail' v-show='foodDet.ratings.length !== 0'>
                            <li class='rate-detail-des border-1px' v-for='(ratings, index) in foodDet.ratings' :key='index' v-show='toggleType(ratings)'>
                                <div class='des-user'>
                                    <span class='user-name'>{{ratings.username}}</span>
                                    <img class='user-avatar' :src='ratings.avatar' alt=''>
                                </div>
                                <div class='des-time'>{{ratings.rateTime | filterDate}}</div>
                                <div class='des-text'>
                                    <i :class='{"icon-thumb_up": ratings.rateType === 0, "icon-thumb_down": ratings.rateType === 1}'></i>
                                    <span class='des-text-content'>{{ratings.text}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>    
        </div>
    </transition>    
</template>

<script>
    import shopButton from '../shopButton/shopButton'
    import partition from '../partition/partition'
    import rateType from '../rateType/rateType'

    import Vue from 'vue'
    import BScroll from 'better-scroll'
    import {formatDate} from '../../common/js/formatDate'

    const ALL = 2

    export default {
        props: ['foodDet'],
        data() {
            return {
                showFlag: false,
                selectType: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                },
                onlyContent: {   // 这里定义成对象是防止 子组件传过来的值 对该数据重新赋值会报错
                    content: false
                },
                markType: ALL
            }
        },
        methods: {
            show() {
                this.showFlag = true
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.innerScroll, {
                            click: true
                        })
                    } else {
                        this.scroll.refresh()
                    }
                })
            },
            hide() {
                this.showFlag = false
            },
            onlyContents(bool) {
                this.onlyContent.content = bool
                this.$nextTick(() => {
                    // 点击只看有内容的评论时 在DOM更新循环后 让better-scroll重新计算 页面体验更好
                    this.scroll.refresh()
                })
            },
            getMark(mark) {
                this.markType = mark
            },
            toggleType(ratings) {   // 好好研究下 这个逻辑
                if (this.onlyContent.content && !ratings.text) {
                    return false
                } else if (this.markType === ALL) {
                    return true
                } else {
                    return ratings.rateType === this.markType
                }
            },
            addFirst(e) {
                this.$emit('add', e.target)
                if (!this.foodDet.count) {
                    Vue.set(this.foodDet, 'count', 1)
                }
            },
            addFood(target) {
                this.$emit('add', target)
            }
        },
        filters: {
            filterDate(time) {
                let dateTime = new Date(time)
                return formatDate(dateTime, 'yyyy-MM-dd hh:mm')
            }
        },
        components: {
            'v-shopButton': shopButton,
            'v-partition': partition,
            'v-rateType': rateType
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/icon.less';
    @import '../../common/less/mixin.less';
    @import '../../common/less/scale.less';

    #foods_detail {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 3.5rem;
        width: 100%;
        background-color: #fff; 
        z-index: 30; 
        &.fade-enter-active,
        &.fade-leave-active {
            transition: all 0.3s;
        }
        &.fade-enter,
        &.fade-leave-to {
            transform: translateX(100%);
        }
        &.fade-enter-to {
            transform: translateX(0);
        }
        .foods_detail-content-wrap {
            /*顶部图片*/
            .foods_detail-img {
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 100%;   /*设置padding是vue加载图片的时候有卡顿 因为父元素的高度是0*/
                > img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .icon-arrow_lift {
                    position: fixed;
                    top: 1rem;
                    left: 1rem;
                    padding: 10px;
                    font-size: 1rem;
                    color: #fff;
                }
            }
            /*图片下内容部分*/
            .foods_detail-content {
                .content-header,
                .content-intro {
                    width: 100%;
                    padding: 1.125rem;
                    box-sizing: border-box;
                }
                /*价格销量*/
                .content-header {
                    position: relative;
                    .content-header-title {
                        font-size: 0.875rem;
                        font-weight: 700;
                        color: rgb(7,17,27);
                        line-height: 0.875rem;
                        margin-bottom: 0.5rem;
                    }
                    .content-header-sales {
                        font-size: 0.625rem;
                        color: rgb(147,153,159);
                        line-height: 0.625rem;
                        margin-bottom: 1.125rem;
                        .sales-count {
                            margin-right: 0.75rem;
                        }
                    }
                    .content-header-price {
                        .now-price,
                        .old-price {
                            font-weight: 700;
                            line-height: 1.5rem;
                        }
                        .now-price {
                            font-size: 0.875rem;
                            color: rgb(240,20,20);
                        }
                        .old-price {
                            font-size: 0.625rem;
                            color: rgb(147,153,159);
                            margin-left: 0.5rem;
                            text-decoration: line-through;
                        }
                    }
                    .shopButton-wrap,
                    .add_shop_cart {
                        position: absolute;
                        right: 0.75rem;
                    }
                    .shopButton-wrap {
                        bottom: 0.75rem;
                    }
                    .add_shop_cart {
                        bottom: 1.125rem;
                        padding: 0.375rem 0.75rem;
                        font-size: 0.625rem;
                        color: #fff;
                        background-color: rgb(0,160,220);
                        border-radius: 20px;
                        &.fade-enter-active,
                        &.fade-leave-active {
                            transition: all 0.2s;
                        }
                        &.fade-enter,
                        &.fade-leave-to {
                            opacity: 0;
                        }
                        &.fade-enter-to {
                            opacity: 1;
                        }
                    }
                }
                /*介绍*/
                .content-intro {
                    .intro-title {
                        margin-bottom: 0.375rem;
                        font-size: 0.875rem;
                        color: rgb(7,17,27);
                        line-height: 0.875rem;
                    }
                    .intro-text {
                        padding: 0 0.5rem;
                        font-size: 0.75rem;
                        color: rgb(77,85,93);
                        line-height: 1.5rem;
                    }
                }
                /*评价*/
                .content-rate {
                    .rate-title {
                        margin-left: 1.125rem;
                        margin-top: 1.125rem;
                        font-size: 0.875rem;
                        color: rgb(7,17,27);
                        line-height: 0.875rem;
                    }
                    .rate-no_ratings {
                        padding: 1rem 0;
                        margin: 0 1.125rem;
                        font-size: 0.75rem;
                        color: rgb(7,17,27);
                    }
                    .rate-detail {
                        .rate-detail-des {
                            position: relative;
                            padding: 1rem 0;
                            margin: 0 1.125rem;
                            .border-1px(rgba(7,17,27,0.2));
                            .des-user {
                                position: absolute;
                                top: 1rem;
                                right: 0;
                                font-size: 0;
                                .user-name {
                                    font-size: 0.625rem;
                                    color: rgb(147,153,159);
                                    margin-right: 0.375rem;
                                }
                                .user-avatar {
                                    display: inline-block;
                                    width: 0.75rem;
                                    height: 0.75rem;
                                    vertical-align: top;
                                    border-radius: 50%;
                                }
                            }
                            .des-time {
                                font-size: 0.625rem;
                                color: rgb(147,153,159);
                                margin-bottom: 0.375rem;
                            }
                            .des-text {
                                .icon-thumb_up,
                                .icon-thumb_down,
                                .des-text-content {
                                    font-size: 0.75rem;
                                }
                                .icon-thumb_up {
                                    color: rgb(0,160,220);
                                }
                                .icon-thumb_down {
                                    color: rgb(147,153,159);
                                }
                                .des-text-content {
                                    color: rgb(7,17,27);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>


