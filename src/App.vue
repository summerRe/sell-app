<template>
    <div id="app">
        <v-header :seller='seller'></v-header>
        <div class='tab border-1px'>
            <div class='tab-item'>
                <router-link to='/goods'>商品</router-link>
            </div>
            <div class='tab-item'>
                <router-link to='/ratings'>评价</router-link>
            </div>
            <div class='tab-item'>
                <router-link to='/seller'>商家</router-link>
            </div>
        </div>
        <!-- keep-alive 保持切换前的状态 -->
        <keep-alive>
            <router-view :seller='seller'></router-view>
        </keep-alive>    
    </div>
</template>

<script>
    import header from './components/header/header'

    import {urlParse} from './common/js/urlParse'
    const ERR_OK = 0

    export default {
        data() {
            return {
                seller: {
                    id: (() => {   // 立即执行函数 获取用户id
                        let user = urlParse()
                        return user.id
                    })()
                }
            }
        },
        components: {
            'v-header': header
        },
        created() {
            // 请求数据并向后端传入用户的id
            this.axios.get('/api/seller?id=' + this.seller.id).then(res => {
                if (res.data.errno === ERR_OK) {
                    // 防止覆盖掉seller.id
                    this.seller = Object.assign({}, this.seller, res.data.data)
                }
            })
        }
    }
</script>

<style scoped lang='less'>
    @import "./common/less/mixin.less";
    @import "./common/less/scale.less";

    .tab {
        display: flex;
        .border-1px(rgba(7,17,27,0.1));
        .tab-item {
            flex: 1;
            height: 2.5rem;
            text-align: center;
            line-height: 2.5rem;
            & > a {
                display: block;
                font-size: 0.875rem;
                color: rgb(77, 85, 93);
                &.router-link-active {
                    color: rgb(240, 20, 20);
                }
            }
        }
    }
</style>
