<template>
    <div id='seller' ref='sellers'>
        <div class='seller-wrap'>
            <!-- 店名和评分 -->
            <div class='seller-grade'>
                <h2 class='grade-title'>{{seller.name}}</h2>
                <div class='grade-sell-wrap'>
                    <v-stars :size='36' :score='seller.score'></v-stars>
                    <span class='grade-rank'>({{seller.ratingCount}})</span>
                    <span class='grade-sell_count'>月售{{seller.sellCount}}单</span>
                </div>
                <!-- 配送信息 -->
                <div class='seller-delivery_des'>
                    <ul class='delivery_des'>
                        <li class='delivery_des-item'>
                            <span class='des-text'>起送价</span>
                            <span class='des-num'>{{seller.minPrice}}</span>元
                        </li>
                        <li class='delivery_des-item'>
                            <span class='des-text'>商家配送</span>
                            <span class='des-num'>{{seller.deliveryPrice}}</span>元
                        </li>
                        <li class='delivery_des-item'>
                            <span class='des-text'>平均配送时间</span>
                            <span class='des-num'>{{seller.deliveryTime}}</span>分钟
                        </li>
                    </ul>
                </div>
                <!-- 收藏按钮 -->
                <div class='seller-collect' @click='toggleCollect'>
                    <i class='icon-favorite' :class='{"active": collect}'></i>
                    <span class='collect-text'>{{collectText}}</span>
                </div>
            </div>
            <v-partition></v-partition>
            <!-- 公告与活动 -->
            <div class='seller-bulletin_act'>
                <!-- 公告 -->
                <div class='seller-bulletin'>
                    <h2 class='bulletin-title'>公告与活动</h2>
                    <p class='bulletin-text'>{{seller.bulletin}}</p>
                </div>
                <!-- 活动 -->
                <div class='seller-act'>
                    <ul class='activities-list' v-if='seller.supports'>
                        <li class='list-wrap' v-for='(value, index) in description' :key='index'>
                            <span class='list-brand' :class='value'></span>
                            <span class='list-text'>{{seller.supports[index].description}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <v-partition></v-partition>
            <!-- 商家图片 -->
            <div class='seller-pics-wrap' v-if='seller.pics'>
                <h2 class='seller-pics-title'>商家实景</h2>
                <div class='seller-pics' ref='sellerPics'>
                    <ul class='pics-content' ref='picsContent'>
                        <li class='pics-item' v-for='(pic, index) in seller.pics' :key='index'>
                            <img width='120' height='90' :src='pic' alt=''>
                        </li>
                    </ul>
                </div>
            </div>
            <v-partition></v-partition>
            <!-- 商家信息 -->
            <div class='seller-info'>
                <h2 class='seller-info-title'>商家信息</h2>
                <ul class='seller-info-list'>
                    <li class='info-item' v-for='(info, index) in seller.infos' :key='index'>{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import stars from '../stars/stars'
    import partition from '../partition/partition'

    import BScroll from 'better-scroll'
    import {saveToLocal, loadFromLocal} from '../../common/js/localStorage'

    export default {
        props: {
            'seller': {
                type: Object
            }
        },
        data() {
            return {
                description: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
                collect: (() => {
                    return loadFromLocal(this.seller.id, 'collect', false)
                })()
            }
        },
        computed: {
            collectText() {
                return this.collect ? '已收藏' : '收藏'
            }
        },
        methods: {
            _initSellerScroll() {
                this.$nextTick(() => {
                    if (!this.sellerScroll) {
                        this.sellerScroll = new BScroll(this.$refs.sellers, {
                            click: true
                        })
                    } else {
                        this.sellerScroll.refresh()
                    }
                })
            },
            _initPicsScroll() {
                if (this.seller.pics) {
                    let liWidth = 120
                    let margin = 6
                    let ulWidth = (liWidth + margin) * this.seller.pics.length - margin

                    this.$nextTick(() => {
                        this.$refs.picsContent.style.width = ulWidth + 'px'
                        if (!this.picsScroll) {
                            this.picsScroll = new BScroll(this.$refs.sellerPics, {
                                scrollX: true,   // 是否横向滚动
                                eventPassthrough: 'vertical'   // 横向滚动的时候 忽略纵向滚动
                            })
                        } else {
                            this.picsScroll.refresh()
                        }
                    })
                }
            },
            toggleCollect() {
                this.collect = !this.collect
                // 调用方法 将收藏的状态进行本地缓存
                saveToLocal(this.seller.id, 'collect', this.collect)
            }
        },
        watch: {   // 监听数据seller变化 出发函数执行
            'seller'() {
                this._initSellerScroll()
                this._initPicsScroll()
            }
        },
        mounted() {
            this._initSellerScroll()
            this._initPicsScroll()
        },
        components: {
            'v-stars': stars,
            'v-partition': partition
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/mixin.less';
    @import '../../common/less/icon.less';

    #seller {
        position: absolute;
        top: 10.875rem;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        .seller-wrap {
            /*店名和评分*/
            .seller-grade {
                position: relative;
                padding: 1.125rem;
                color: rgb(7,17,27);
                .grade-title {
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                }
                .grade-sell-wrap {
                    margin-bottom: 1.125rem;
                    font-size: 0;
                    .grade-rank,
                    .grade-sell_count {
                        display: inline-block;
                        vertical-align: top;
                        font-size: 0.625rem;
                        line-height: 0.938rem;
                    }
                    #star {
                        display: inline-block;
                    }
                    .grade-rank {
                        margin: 0 0.75rem 0 0.5rem;
                    }
                }
                /*配送信息*/
                .seller-delivery_des {
                    border-top: 1px solid rgba(7,17,27,0.1);
                    padding-top: 1.125rem;
                    .delivery_des {
                        display: flex;
                        .delivery_des-item {
                            flex: 1;
                            font-size: 0.625rem;
                            text-align: center;
                            border-right: 1px solid rgba(7,17,27,0.1);
                            &:last-child {
                                border-right: none;
                            }
                            .des-text {
                                display: block;
                                margin-bottom: 0.25rem; 
                                color: rgb(147,153,159);
                            }
                            .des-num {
                                font-size: 1.5rem;
                            }
                        }
                    }
                }
                /*收藏按钮*/
                .seller-collect {
                    position: absolute;
                    top: 1.25rem;
                    right: 1.125rem;
                    width: 2.25rem;
                    text-align: center;
                    .icon-favorite {
                        display: block;
                        font-size: 1.5rem;
                        color: #d4d6d9;
                        &.active {
                            color: rgb(240,20,20);
                        }
                    }
                    .collect-text {
                        font-size: 0.625rem;
                        color: rgb(77,85,93);
                    }
                }
            }
            /*公告与活动*/
            .seller-bulletin_act {
                padding: 0 1.125rem;
                /*公告*/
                .seller-bulletin {
                    padding: 1.125rem 0 1rem 0;
                    .bulletin-title {
                        margin-bottom: 0.5rem;
                        font-size: 0.875rem;
                        color: rgb(7,17,27);
                    }
                    .bulletin-text {
                        padding: 0 0.75rem;
                        font-size: 0.75rem;
                        line-height: 1.5rem;
                        color: rgb(240,20,20);
                    }
                }
                /*活动*/
                .seller-act {
                    .activities-list {
                        width: 100%;
                        .list-wrap {
                            padding: 1rem 0.75rem;
                            border-top: 1px solid rgba(7,17,27,0.1);
                            .list-brand {
                                display: inline-block;
                                width: 1rem;
                                height: 1rem;
                                background-repeat: no-repeat;
                                background-size: 1rem 1rem;
                                margin-right: 0.375rem;
                                &.decrease {
                                    .bg-img(decrease_4);
                                }
                                &.discount {
                                    .bg-img(discount_4);
                                }
                                &.special {
                                    .bg-img(special_4);
                                }
                                &.invoice {
                                    .bg-img(invoice_4);
                                }
                                &.guarantee {
                                    .bg-img(guarantee_4);
                                }
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
            }
            /*商家实景*/
            .seller-pics-wrap {
                width: 100%;
                padding: 1.125rem;
                .seller-pics-title {
                    margin-bottom: 0.75rem;
                    font-size: 0.875rem;
                }
                .seller-pics {
                    overflow: hidden;
                    .pics-content {
                        display: flex;
                        .pics-item {
                            flex: 1;
                            margin-right: 0.375rem;
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
            /*商家信息*/
            .seller-info {
                padding: 1.125rem;
                .seller-info-title {
                    margin-bottom: 0.75rem;
                    font-size: 0.875rem;
                }
                .seller-info-list {
                    .info-item {
                        padding: 1rem 0.75rem;
                        border-top: 1px solid rgba(7,17,27,0.1);
                        font-size: 0.75rem;
                        line-height: 1rem;
                    }
                }
            }
        }
    }
</style>
