<template>
    <div id='shop_cart'>
        <!-- 购物车主体 -->
        <div class='shop_cart-content'>
             <!-- 左侧数量及价格 -->
            <div class='shop_cart-left' @click='toggleList'>
                <!-- logo -->
                <div class='shop_cart-logo-wrap'>
                    <div class='shop_cart-logo' :class='{"height-light": totalCount > 0}'>
                        <i class='icon-shopping_cart' :class='{"height-light": totalCount > 0}'></i>
                    </div>
                    <div class='shop_cart-num' v-show='totalCount > 0'>{{totalCount}}</div>
                </div>
                <!-- 总价 -->
                <div class='shop_cart-total_price'>￥{{totalPrice}}</div>
                <!-- 价钱描述 -->
                <div class='shop_cart-price_des'>另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <!-- 右侧结算 -->
            <div class='shop_cart-right' @click='pay'>
                <div class='shop_cart-account' :class='{"height-light": totalPrice >= minPrice}'>{{account}}</div>
            </div>
        </div>
        <!-- 小球结构 -->
        <div class='shop_cart-balls'>
            <div v-for='(ball, index) in balls' :key='index'>
                <!-- 过渡钩子函数 -->
                <transition name='drop' @before-enter='beforeDrop' @enter='droping' @after-enter='afterDrop'>
                    <div class='balls-content' v-show='ball.show'>
                        <div class='balls-content-inner inner-hook'></div>
                    </div>
                </transition>    
            </div>
        </div>
        <!-- 已选商品列表 -->
        <transition name='list'>
            <div class='shop_cart-list' v-show='listFold'>
                <div class='list-header'>
                    <h1 class='list-header-title'>购物车</h1>
                    <span class='list-header-empty' @click='emptyList'>清空</span>
                </div>
                <div class='list-content' ref='listContent'>
                    <ul>
                        <li class='list-content-foods border-1px' v-for='(food, index) in selFoods' :key='index'>
                            <div class='list-content-foods_name'>{{food.name}}</div>
                            <div class='list-content-foods_price'>￥{{food.price}}</div>
                            <div class='shop_button-wrap'>
                                <v-shopButton :foods='food'></v-shopButton>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>  
        <!-- 列表上遮罩层 -->
        <transition name='mask'>
            <div class='shop_cart-mask' v-show='listFold'></div>
        </transition>  
    </div>
</template>

<script>
    import shopButton from '../shopButton/shopButton'
    import BScroll from 'better-scroll'

    export default {
        props: ['selFoods', 'minPrice', 'deliveryPrice'],
        data() {
            return {
                fold: true,
                // 定义5个小球用于动画 以便多次点击时 屏幕出现多个小球
                balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
                // 用来存储下落的小球
                dropBalls: []
            }
        },
        computed: {
            totalPrice() {
                let price = 0
                this.selFoods.forEach((v) => {
                    price += v.price * v.count
                })
                return price
            },
            totalCount() {
                let count = 0
                this.selFoods.forEach((v) => {
                    count += v.count
                })
                return count
            },
            account() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}元起送`
                } else if (this.totalPrice < this.minPrice) {
                    let tempPrice = this.minPrice - this.totalPrice
                    return `还差￥${tempPrice}元起送`
                } else {
                    return '去结算'
                }
            },
            listFold() {
                if (!this.totalCount) {
                    this.fold = true
                    return false
                }
                let show = !this.fold
                if (show) {  // 对商品列表内容超出限定最大高度时进行滚动
                    this.$nextTick(() => {
                        if (!this.scroll) {   // 防止每次都new BScroll
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            })
                        } else {
                            // refresh是better-scroll内部的一个接口 计算x y的值并滚动
                            this.scroll.refresh()
                        }
                    })
                }
                return show
            }
        },
        methods: {
            drop(el) {   // el 是父组件传递过来的shopButton点击的DOM
                for (let i = 0; i < this.balls.length; i++) {
                    if (!this.balls[i].show) {   // 将已经下落的小球取出 push进数组 并保存DOM
                        this.balls[i].show = true
                        this.balls[i].el = el
                        this.dropBalls.push(this.balls[i])
                        return false   // 跳出循环并终止函数
                    }
                }
            },
            beforeDrop(el) {
                // 如果多次点击 获取所有为true的小球
                let count = this.balls.length
                while (count--) {
                    let ball = this.balls[count]
                    if (ball.show) {
                        // getBoundingClientRect方法用来获取目标元素位于视口的位置集合
                        let rect = ball.el.getBoundingClientRect()
                        // 计算初始位置和目标位置的距离 X Y
                        let x = rect.left - 32
                        // window.innerHeight只读属性 声明了窗口的文档显示区的高度 以像素计
                        let y = -(window.innerHeight - rect.top - 22)
                        el.style.display = ''
                        // 外层做纵向运动
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`
                        el.style.transform = `translate3d(0,${y}px,0)`
                        // 获取el的子元素 并做横向运动
                        let inner = el.getElementsByClassName('inner-hook')[0]
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`
                        inner.style.transform = `translate3d(${x}px,0,0)`
                    }
                }
            },
            droping(el) {
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight   // 手动触发浏览器重绘 并且声明注释 跳过eslint检查
                // 重置小球的样式
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0,0,0)'
                    el.style.transform = 'translate3d(0,0,0)'
                    let inner = el.getElementsByClassName('inner-hook')[0]
                    inner.style.webkitTransform = 'translate3d(0,0,0)'
                    inner.style.transform = 'translate3d(0,0,0)'
                })
            },
            afterDrop(el) {
                // 每一个小球运动结束后 将状态重置为false
                let ball = this.dropBalls.shift()
                if (ball) {
                    ball.show = false
                    el.style.display = 'none'
                }
            },
            toggleList() {
                if (!this.totalCount) {
                    return false
                }
                this.fold = !this.fold
            },
            emptyList() {
                this.selFoods.forEach((v) => {
                    v.count = 0
                })
            },
            pay() {
                if (this.totalPrice >= this.minPrice) {
                    confirm('确认付款')
                }
            }
        },
        components: {
            'v-shopButton': shopButton
        }
    }
</script>

<style lang='less' scoped>
    @import '../../common/less/icon.less';
    @import '../../common/less/mixin.less';

    #shop_cart {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 3rem;
        z-index: 99;
        /*购物车主体*/
        .shop_cart-content {
            display: flex;
            background-color: #141d27;
            color: rgba(255,255,255,0.4);
            font-size: 0;
            z-index: 50;
            /*左侧logo和描述*/
            .shop_cart-left {
                flex: 1;
                .shop_cart-logo-wrap {
                    display: inline-block;
                    position: relative;
                    top: -0.625rem;
                    width: 3.5rem;
                    height: 3.5rem;
                    box-sizing: border-box;
                    margin: 0 1.125rem;
                    padding: 0.375rem;
                    border-radius: 50%;
                    background-color: #141d27;
                    .shop_cart-logo {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background-color: #2b343c;
                        text-align: center;
                        &.height-light {
                            background-color: rgb(0, 160, 220);
                        }
                        .icon-shopping_cart {
                            font-size: 1.5rem;
                            line-height: 2.75rem;
                            &.height-light {
                                color: #fff;
                            }
                        }
                    }
                    .shop_cart-num {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 1.5rem;
                        font-size: 0.5625rem;
                        font-weight: 700;
                        line-height: 1rem;
                        text-align: center;
                        background-color: rgb(240,20,20);
                        color: #fff;
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
                        border-radius: 20px;
                    }
                }
                .shop_cart-total_price,
                .shop_cart-price_des {
                    display: inline-block;
                    line-height: 1.5rem;
                    vertical-align: top;
                }
                .shop_cart-total_price {
                    margin-top: 0.75rem;
                    padding-right: 0.75rem;
                    font-size: 1rem;
                    font-weight: 700;
                    border-right: 1px solid rgba(255,255,255,0.1);
                }
                .shop_cart-price_des {
                    margin: 0.75rem 0 0 0.75rem;
                    font-size: 0.625rem;
                }
            }
             /*右侧结算*/
            .shop_cart-right {
                flex: 0 0 6.5625rem;
                .shop_cart-account {
                    font-size: 0.75rem;
                    font-weight: 700;
                    line-height: 3rem;
                    text-align: center;
                    background-color: #2b333b;
                    &.height-light {
                        background-color: #00b43c;
                        color: #fff;
                    }
                }
            }
        }
        /*小球*/
        .shop_cart-balls {
            .balls-content {   /*外层做纵向运动*/
                position: fixed;
                left: 32px;
                bottom: 22px;
                z-index: 200;
                transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);   /*贝塞尔曲线*/
                .balls-content-inner {   /*内层做横向运动*/
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background-color: rgb(0, 160, 220);
                    transition: all 0.4s linear;
                }
            }
        }
        /*已选商品列表*/
        .shop_cart-list {
            position: absolute;
            bottom: 3rem;
            left: 0;
            width: 100%;
            z-index: -1;
            &.list-enter-active,
            &.list-leave-active {
                transition: all 0.4s linear;
            }
            &.list-enter,
            &.list-leave-to {
                /*100%是相对自身高度 因为高度是动态变化的 所以用100%*/
                transform: translate3d(0,100%,0);   
            }
            &.list-enter-to {
                transform: translate3d(0,0,0);
            }
            .list-header {
                height: 2.5rem;
                border-bottom: 1px solid rgba(7,17,27,0.1);
                padding: 0 1.125rem;
                background-color: #f3f5f7;
                .list-header-title {
                    float: left;
                    font-size: 0.875rem;
                    color: rgb(7,17,27);
                    line-height: 2.5rem;
                }
                .list-header-empty {
                    float: right;
                    font-size: 0.75rem;
                    color: rgb(0,160,220);
                    line-height: 2.5rem;
                }
            }
            .list-content {
                background-color: #fff;
                max-height: 13.563rem;
                overflow: hidden;
                .list-content-foods {
                    position: relative;
                    height: 3rem;
                    padding: 0.75rem 0;
                    margin: 0 1.125rem;
                    box-sizing: border-box;
                    .border-1px(rgba(7,17,27,0.1));
                    .list-content-foods_name {
                        font-size: 0.875rem;
                        font-weight: 700;
                        line-height: 1.5rem;
                        color: rgb(7,17,27);
                    }
                    .list-content-foods_price {
                        position: absolute;
                        right: 5.25rem;
                        bottom: 0.75rem;
                        font-size: 0.875rem;
                        font-weight: 700;
                        line-height: 1.5rem;
                        color: rgb(240,20,20);
                    }
                    .shop_button-wrap {
                        position: absolute;
                        right: 0;
                        bottom: 0.3125rem;
                    }
                }
            }
        }
        /*遮罩层*/
        .shop_cart-mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            background-color: rgba(7,17,27,0.6);
            backdrop-filter: blur(10px);
            &.mask-enter-active,
            &.mask-leave-active {
                transition: all 0.4s linear;
            }
            &.mask-enter,
            &.mask-leave-to {
                opacity: 0;
                background-color: rgb(7,17,27,0);
                backdrop-filter: blur(0);   /*ios下有效*/
            }
            &.mask-enter-to {
                opacity: 1;
                background-color: rgba(7,17,27,0.6);
                backdrop-filter: blur(10px);   /*ios下有效*/
            }
        }
    }
</style>


