<template>
    <div id='ratings' ref='ratings'>
        <div class='ratings-wrap' v-if='ratings'>
            <!-- 上边评分部分 -->
            <div class='ratings-grade'>
                <div class='grade-left'>
                    <div class='grade-left-wrap'>
                        <span class='grade-left-score'>{{seller.score}}</span>
                        <span class='grade-left-text'>综合评分</span>
                        <span class='grade-left-ratio'>高于周边商家{{seller.rankRate}}%</span>
                    </div>
                </div>
                <div class='grade-right'>
                    <div class='grade-right-wrap'>
                        <div class='grade-right-item'>
                            <span class='item-text'>服务态度</span>
                            <v-stars :size='36' :score='seller.serviceScore'></v-stars>
                            <span class='item-score'>{{seller.serviceScore}}</span>
                        </div>
                        <div class='grade-right-item'>
                            <span class='item-text'>商品评分</span>
                            <v-stars :size='36' :score='seller.foodScore'></v-stars>
                            <span class='item-score'>{{seller.foodScore}}</span>
                        </div>
                        <div class='grade-right-item'>
                            <span class='item-text'>送达时间</span>
                            <span class='item-delivery_time'>{{seller.deliveryTime}}分钟</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 分割线 -->
            <v-partition></v-partition>
            <!-- 评价类型选择组件 -->
            <v-rateType :selType='selectType' :ratings='ratings' :onlyContent='onlyContent' @marks='getMark' @hadContent='onlyContents'></v-rateType>
            <!-- 评价内容列表 -->
            <div class='ratings-item-wrap'>
                <ul>
                    <li class='ratings-item border-1px' v-for='(items, index) in ratings' :key='index' v-show='toggleType(items)'>
                        <!-- 左侧用户头像 -->
                        <div class='item-user_avatar'>
                            <img :src='items.avatar' alt=''>
                        </div>
                        <!-- 右侧具体评价内容 -->
                        <div class='item-content'>
                            <span class='item-rate_time'>{{items.rateTime | filterDate}}</span>
                            <div class='item-user_name'>{{items.username}}</div>
                            <div class='item-serve'>
                                <v-stars :size='24' :score='items.score'></v-stars>
                                <span class='serve-delivery_time' v-show='items.deliveryTime'>{{items.deliveryTime}}分钟送达</span>
                            </div>
                            <p class='item-rate_text'>{{items.text}}</p>
                            <div class='item-recommend'>
                                <i :class='{"icon-thumb_up": items.rateType === 0, "icon-thumb_down": items.rateType === 1}'></i>
                                <span class='recommend_food' v-for='(recomFood, index) in items.recommend' :key='index'>{{recomFood}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import {formatDate} from '../../common/js/formatDate'

    import stars from '../stars/stars'
    import partition from '../partition/partition'
    import rateType from '../rateType/rateType'

    const ERR_OK = 0
    const ALL = 2

    export default {
        props: {
            'seller': {
                type: Object
            }
        },
        data() {
            return {
                ratings: [],
                selectType: {
                    'all': '全部',
                    'positive': '满意',
                    'negative': '不满意'
                },
                onlyContent: {
                    content: false
                },
                markValue: ALL
            }
        },
        created() {
            this.axios.get('/api/ratings').then((res) => {
                if (res.data.errno === ERR_OK) {
                    this.ratings = res.data.data
                    // 更改ratings的时候 dom没有立即更新 所以调用$nextTick方法 在有数据的情况下滚动
                    this.$nextTick(() => {
                        this.scroll = new BScroll(this.$refs.ratings, {
                            click: true
                        })
                    })
                }
            })
        },
        methods: {
            onlyContents(bool) {
                this.onlyContent.content = bool
                // 在dom更新后 让better-scroll重新计算刷新
                this.$nextTick(() => {
                    this.scroll.refresh()
                })
            },
            getMark(mark) {
                this.markValue = mark
            },
            toggleType(ratings) {
                if (this.onlyContent.content && !ratings.text) {
                    return false
                } else if (this.markValue === ALL) {
                    return true
                } else {
                    return ratings.rateType === this.markValue
                }
            }
        },
        filters: {
            filterDate(time) {
                let dateTime = new Date(time)
                return formatDate(dateTime, 'yyyy-MM-dd hh-mm')
            }
        },
        components: {
            'v-stars': stars,
            'v-partition': partition,
            'v-rateType': rateType
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/icon.less';
    @import '../../common/less/mixin.less';
    @import '../../common/less/scale.less';

    #ratings {
        position: absolute;
        top: 10.875rem;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        .ratings-wrap {
            /*上边评分部分*/
            .ratings-grade {
                display: flex;
                .grade-left {
                    @media screen and(max-width: 320px) {
                        flex: 0 0 5.25rem;
                    }   
                    flex: 0 0 8.563rem;
                    padding: 1.125rem 0;
                    .grade-left-wrap {
                        padding: 0.375rem 0 0.75rem 0;
                        border-right: 1px solid rgba(147,153,159,0.2);
                        .grade-left-score,
                        .grade-left-text,
                        .grade-left-ratio {
                            display: block;
                            text-align: center;
                        }
                        .grade-left-score {
                            margin-bottom: 0.375rem;
                            font-size: 1.5rem;
                            color: rgb(255,153,0);
                        }
                        .grade-left-text {
                            margin-bottom: 0.5rem;
                            font-size: 0.75rem;
                            color: rgb(7,17,27);
                        }
                        .grade-left-ratio {
                            font-size: 0.625rem;
                            color: rgb(147,153,159);
                        }
                    }
                }
                .grade-right {
                    flex: 1;
                    padding: 1.125rem 0;
                    .grade-right-wrap {
                        padding: 0.375rem 0 0.75rem 1.5rem;
                        .grade-right-item {
                            margin-bottom: 0.5rem;
                            font-size: 0;
                            &:last-child {
                                margin-bottom: 0;
                            }
                            .item-text,
                            .item-score,
                            .item-delivery_time {
                                display: inline-block;
                                vertical-align: top;
                                line-height: 0.938rem;
                            }
                            .item-text {
                                font-size: 0.75rem;
                                color: rgb(7,17,27);
                            }
                            #star {
                                display: inline-block;
                                vertical-align: top;
                                margin: 0 0.75rem;
                                line-height: 0.375rem;
                            }
                            .item-score {
                                font-size: 0.75rem;
                                color: rgb(255,153,0);
                            }
                            .item-delivery_time {
                                margin-left: 0.75rem;
                                font-size: 0.75rem;
                                color: rgb(147,153,159);
                            }
                        }
                    }
                }
            }
            /*评价内容列表*/
            .ratings-item-wrap {
                .ratings-item {
                    display: flex;
                    padding: 1.125rem 0;
                    margin: 0 1.125rem;
                    .border-1px(rgba(147,153,159,0.2));
                    .item-user_avatar {
                        flex: 0 0 3.5rem;
                        > img {
                            width: 1.75rem;
                            border-radius: 50%;
                        }
                    }
                    .item-content {
                        flex: 1;
                        position: relative;
                        color: rgb(7,17,27);
                        font-size: 0;
                        .item-rate_time {
                            position: absolute;
                            top: 0;
                            right: 0;
                            font-size: 0.625rem;
                            color: rgb(147,153,159);
                        }
                        .item-user_name {
                            font-size: 0.625rem;
                            margin-bottom: 0.25rem;
                        }
                        .item-serve {
                            margin-bottom: 0.375rem;
                            #star {
                                display: inline-block;
                                margin-right: 0.375rem;
                            }
                            .serve-delivery_time {
                                font-size: 0.625rem;
                                color: rgb(147,153,159);
                            }
                        }
                        .item-rate_text {
                            margin-bottom: 0.5rem;
                            font-size: 0.75rem;
                            line-height: 1.125rem;
                        }
                        .item-recommend {
                            .icon-thumb_up,
                            .icon-thumb_down,
                            .recommend_food {
                                display: inline-block;
                                margin: 0 0.5rem 0.5rem 0;
                            }
                            .icon-thumb_up {
                                font-size: 0.75rem;
                                color: rgb(0,160,220);
                            }
                            .icon-thumb_down {
                                font-size: 0.75rem;
                                color: rgb(183,187,191);
                            }
                            .recommend_food {
                                padding: 0 0.375rem;
                                border: 1px solid rgba(7,17,27,0.1);
                                border-radius: 2px;
                                font-size: 0.375rem;
                                color: rgb(147,153,159);
                            }
                        }
                    }
                }
            }
        }
    }
</style>
