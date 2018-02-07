<template>
  <div id='goods'>
    <!-- 左侧菜单栏 -->
    <div class='menu-wrap' ref='menuWrap'>
        <ul class='menu-list'>
            <li class='menu-list-item' v-for='(value, index) in goods' :key='index' :class='{"active": currentIndex === index}' @click='ganged(index, $event)'>
                <span class='list-item-text border-1px'>
                    <span class='list-item-brand' v-show='value.type != -1' :class='description[value.type]'></span>{{value.name}}
                </span>
            </li>
        </ul>
    </div>
    <!-- 右侧商品食物 -->
    <div class='foods-wrap' ref='foodsWrap'>
        <ul class='foods-group' v-if='goods'>
            <!-- 食物分类 -->
            <li class='foods-type foods-type-hook' v-for='(type, index1) in goods' :key='index1'>
                <!-- 分类标题 -->
                <h2 class='foods-type-title'>{{type.name}}</h2>
                <!-- 分类下具体的食物 -->
                <ul class='foods-list'>
                    <li class='foods-item border-1px' v-for='(food, index2) in type.foods' :key='index2' @click='foodDetail(food)'>
                        <!-- 左侧食物图片 -->
                        <div class='foods-item-icon'>
                            <img :src="food.icon" alt="" width="57" height="57">
                        </div>
                        <!-- 右侧描述 -->
                        <div class='foods-item-detail'>
                            <h3 class='item-detail-title'>{{food.name}}</h3>
                            <div class='item-detail-desc'>{{food.description}}</div>
                            <div class='item-detail-sales'>
                                <span class='sales-count'>月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                            </div>
                            <div class='item-detail-price'>
                                <span class='now-price'>￥{{food.price}}</span><span class='old-price' v-show='food.oldPrice'>￥{{food.oldPrice}}</span>
                            </div>
                        </div>
                        <!-- 购买按钮 -->
                        <div class='shop_button-wrap'>
                            <v-shopButton :foods='food' @add='addFood'></v-shopButton>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <!-- 最下边购物车 -->
    <v-shopCart :selFoods='selectFoods' :minPrice='minPrice' :deliveryPrice='deliveryPrice' ref='shopCart'></v-shopCart>
    <!-- 食物详情页 -->
    <v-foodsDetail :foodDet='foodDet' ref='foodsDet' @add='addFood'></v-foodsDetail>
  </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import shopCart from '../shopCart/shopCart'
    import shopButton from '../shopButton/shopButton'
    import foodsDetail from '../foodsDetail/foodsDetail.vue'

    const ERR_OK = 0

    export default {
        data() {
            return {
                scrollY: 0,
                goods: [],
                foodsHeight: [],
                foodsList: [],
                description: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
                minPrice: 20,
                deliveryPrice: 4,
                foodDet: {}
            }
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.foodsHeight.length; i++) {
                    let height1 = this.foodsHeight[i]
                    let height2 = this.foodsHeight[i + 1]
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i   // vue的计算属性的特性 根据scrollY的变化实时计算return的i
                    }
                }
                return 0
            },
            selectFoods() {
                let selFoods = []
                this.goods.forEach((v1) => {
                    v1.foods.forEach((v2) => {
                        if (v2.count) {
                            selFoods.push(v2)
                        }
                    })
                })
                return selFoods
            }
        },
        methods: {
            _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuWrap, {
                    click: true   // 设置该属性 元素的点击事件才好用 底层为派发点击事件
                })
                this.foodsScroll = new BScroll(this.$refs.foodsWrap, {
                    click: true,
                    probeType: 3   // 实时监听元素滚动的位置 设置这个属性 下边的position.y才有效
                })

                this.foodsScroll.on('scroll', (position) => {   // 动态获取右侧滚动的Y轴坐标
                    this.scrollY = Math.abs(Math.round(position.y))
                })
            },
            _calHeight() {
                let height = 0
                this.foodsList = this.$refs.foodsWrap.getElementsByClassName('foods-type-hook')
                this.foodsHeight.push(height)
                for (let i = 0; i < this.foodsList.length; i++) {
                    height += this.foodsList[i].clientHeight
                    this.foodsHeight.push(height)
                }
            },
            _drop(target) {
                this.$refs.shopCart.drop(target)   // 向子组件传递点击的DOM
            },
            ganged(i, e) {
                // 这里因为本人测试的时候没有console两次的情况出现 所以就不判断原生点击事件了
                let ele = this.foodsList[i]
                this.foodsScroll.scrollToElement(ele, 300)
            },
            addFood(target) {  // 子组件派发过来事件 执行函数
                this._drop(target)
            },
            foodDetail(food) {
                this.foodDet = food
                this.$refs.foodsDet.show()   // 调用foodsDetail的show方法
            }
        },
        created() {
            this.axios.get('/api/goods').then((res) => {   // 箭头函数中的this指向的是词法作用域
                if (res.data.errno === ERR_OK) {
                    this.goods = res.data.data

                    this.$nextTick(() => {   // 在下次DOM更新循环之后 执行回调
                        this._initScroll()
                        this._calHeight()
                    })
                }
            })
        },
        components: {
            'v-shopCart': shopCart,
            'v-shopButton': shopButton,
            'v-foodsDetail': foodsDetail
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/mixin.less';
    @import '../../common/less/scale.less';

    #goods {
        position: absolute;
        display: flex;
        top: 10.875rem;
        bottom: 3.625rem;
        width: 100%;
        background-color: #f3f5f7;
        overflow: hidden;
        /*左侧菜单*/
        .menu-wrap {
            flex: 0 0 5rem;
            .menu-list {
                .menu-list-item {
                    display: table;   /*垂直居中*/
                    width: 3.5rem;
                    height: 3.375rem;
                    padding: 0 0.75rem;
                    &.active {
                        position: relative;
                        margin-top: -1px;
                        font-weight: 700;
                        background-color: #fff;
                        .list-item-text {
                            .border-none;
                        }
                    }
                    .list-item-text {
                        display: table-cell;   /*垂直居中*/
                        vertical-align: middle;   /*垂直居中*/
                        font-size: 0.75rem;
                        font-weight: 200;
                        .border-1px(rgba(7,17,27,0.1));
                        .list-item-brand {
                            display: inline-block;
                            width: 0.75rem;
                            height: 0.75rem;
                            background-repeat: no-repeat;
                            background-size: 0.75rem 0.75rem;
                            vertical-align: top;
                            margin-right: 0.125rem;
                            &.decrease {
                                .bg-img(decrease_3);
                            }
                            &.discount {
                                .bg-img(discount_3);
                            }
                            &.special {
                                .bg-img(special_3);
                            }
                            &.invoice {
                                .bg-img(invoice_3);
                            }
                            &.guarantee {
                                .bg-img(guarantee_3);
                            }
                        }
                    }
                }
            }
        }
        /*右侧食物*/
        .foods-wrap {
            flex: 1;
            .foods-group {
                background-color: #fff;
                .foods-type {
                    .foods-type-title {
                        height: 1.625rem;
                        line-height: 1.625rem;
                        padding-left: 0.875rem;
                        font-size: 0.75rem;
                        color: rgb(147,153,159);
                        border-left: 2px solid #d9dde1;
                        background-color: #f3f5f7;
                    }
                    .foods-list {
                        font-size: 0;
                        .foods-item {
                            display: flex;
                            margin: 1.125rem;
                            padding-bottom: 1.125rem;
                            .border-1px(rgba(7,17,27,0.1));
                            &:last-child {
                                .border-none;
                                margin-bottom: 0;
                            }
                            /*食物图片*/
                            .foods-item-icon {
                                flex: 0 0 57px;
                                vertical-align: top;
                            }
                            /*右侧具体描述*/
                            .foods-item-detail {
                                flex: 1;
                                margin-left: 0.625rem;
                                .item-detail-title {
                                    font-size: 0.875rem;
                                    color: rgb(7,17,27);
                                    line-height: 0.875rem;
                                    margin: 0.125rem 0 0.5rem;
                                }
                                .item-detail-desc,
                                .item-detail-sales {
                                    font-size: 0.625rem;
                                    color: rgb(147,153,159);
                                    line-height: 0.625rem;
                                    margin-bottom: 0.5rem;
                                }
                                .item-detail-desc {
                                    line-height: 0.75rem;
                                }
                                .item-detail-sales {
                                    .sales-count {
                                        margin-right: 0.75rem;
                                    }
                                }
                                .item-detail-price {
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
                            }
                            /*购买按钮*/
                            .shop_button-wrap {
                                position: absolute;
                                right: 0;
                                bottom: 0.75rem;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
