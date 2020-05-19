
const isProduction = process.env.NODE_ENV === 'production'
const CompressionPlugin = require('compression-webpack-plugin')

const cdns = (() => {
    const domain = `https://cdn.jsdelivr.net/npm/`
    const data = {
        'vue': {
            externals: 'Vue',
            js: v => `vue@${v}/dist/vue.min.js`
        },
        'vue-router': {
            externals: 'VueRouter',
            js: v => `vue-router@${v}/dist/vue-router.min.js`
        },
        'vuex': {
            externals: 'Vuex',
            js: v => `vuex@${v}/dist/vuex.min.js`
        },
        'axios': {
            externals: 'axios',
            js: v => `axios@${v}/dist/axios.min.js`
        },
        'vant': {
            externals: 'vant',
            js: v => `vant@${v}/lib/vant.min.js`,
            css: v => `vant@${v}/lib/index.css`
        },
    }
    const keys = Object.keys(data)
    // 获取package.json文件里的dependencies
    // const dependencies = JSON.parse(fs.readFileSync('./package.json', 'utf-8')).dependencies
    const dependencies = require('./package.json').dependencies
    // 配置相同版本号的cdn
    const cdn = {
        css: [],
        js: []
    }
    const externals = {}
    // 开发环境下不使用cdn，有些错误提示就没了，懒得改
    if (isProduction) {
        keys
            .forEach(key => {
                const version = dependencies[key]
                if (version) {
                    const v = /\d.+$/.exec(version)[0]
                    const item = data[key]
                    externals[key] = item.externals
                    if (item.js) cdn.js.push(`${domain}${item.js(v)}`)
                    if (item.css) cdn.css.push(`${domain}${item.css(v)}`)
                }
            })
    }
    return { externals, cdn }
})();

module.exports = {
    publicPath: './', // 生产环境基本路径
    assetsDir: 'admin', // 静态资源放置目录
    filenameHashing: true, // 开启文件hash
    productionSourceMap: !isProduction, // 是否开启map
    css: {
        extract: true, // 是否使用css分离插件 ExtractTextPlugin
    },
    configureWebpack: config => {
        if (isProduction) {
            config.plugins.push(
                new CompressionPlugin({ // gzip插件
                    test: /\.js$|\.css$/, // 匹配文件名
                    deleteOriginalAssets: false, // 是否删除原文件
                    algorithm: "gzip", // 压缩算法
                    threshold: 0, // 文件超过多少压缩
                    minRatio: 0.8, // 压缩比例
                })
            )
        }
        return {
            externals: cdns.externals,
        }
    },
    // 添加CDN参数到htmlWebpackPlugin配置中
    chainWebpack: config => {
        config.plugin('html')
            .tap(args => {
                args[0].title = '面具奇缘后台操作系统'
                args[0].cdn = cdns.cdn
                return args
            })
    }
}