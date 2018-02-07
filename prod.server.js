const express = require('express')
const config = require('./config')

const port = process.env.PORT || config.build.port

const app = express()

// 定义路由
const router = express.Router()

// 路由访问根目录时
router.get('/', function (req, res, next) {
    // 请求的url指向index.html
    req.url = '/index.html'
    next()
})

app.use(router)

const appData = require('./data.json')

// 分别获得数据中的分类
let seller = appData.seller
let goods = appData.goods
let ratings = appData.ratings

// 配置路由
const routers = express.Router()

// 自己配置的路由
app.get('/api/seller', (req, res) => {   //配置接口 并返回数据
    res.json({
        errno: 0,   //标识符 不同的数字代表不同的意思 因为这里的mock的数据 所以都取0
        data: seller
    })
}),

app.get('/api/goods', (req, res) => {
    res.json({
        errno: 0,
        data: goods
    })
}),

app.get('/api/ratings', (req, res) => {
    res.json({
        errno: 0,
        data: ratings
    })
})

app.use('/api', routers)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})
