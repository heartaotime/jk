// 导入compression-webpack-plugin
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 定义压缩文件类型
// const productionGzipExtensions = ['js', 'css'];

module.exports = {
    publicPath: '/jk',
    productionSourceMap: false,
    // 统一配置打包插件
    // configureWebpack: () => {
    //     if (process.env.NODE_ENV === 'production')
    //         return {
    //             plugins: [
    //                 new CompressionWebpackPlugin({
    //                     // asset: '[path].gz[query]',
    //                     filename: '[path].gz[query]',
    //                     algorithm: 'gzip',
    //                     test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),//匹配文件名
    //                     // threshold: 10240, // 对10K以上的数据进行压缩
    //                     minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
    //                     deleteOriginalAssets: true, // 是否删除源文件
    //                 })
    //             ]
    //         }
    // },
    // configureWebpack: config => {
    //     if (process.env.NODE_ENV === 'production') {
    //         return {
    //             plugins: [
    //                 new CompressionPlugin({
    //                     test: productionGzipExtensions,
    //                     deleteOriginalAssets: true // 是否删除源文件
    //                 })
    //             ]
    //         }
    //     }
    // },

    devServer: {
        port: 9000,
        host: '0.0.0.0',
        disableHostCheck: true,
        proxy: {
            '/common-server': {
                target: 'http://47.100.96.24:5000/',
                // target: 'http://127.0.0.1:5000/',
                // ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/common-server': ''
                }
            },
            '/bingBgImg': {
                target: 'https://cn.bing.com/HPImageArchive.aspx/',
                changeOrigin: true,
                pathRewrite: {
                    '^/bingBgImg': ''
                }
            },
            '/toutiao': {
                target: 'https://www.toutiao.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/toutiao': ''
                }
            },
            '/apiopen': {
                target: 'https://api.apiopen.top/',
                changeOrigin: true,
                pathRewrite: {
                    '^/apiopen': ''
                }
            },
            '/douyu': {
                target: 'http://capi.douyucdn.cn/',
                changeOrigin: true,
                pathRewrite: {
                    '^/douyu': ''
                }
            },
            '/mxnzp': {
                target: 'https://www.mxnzp.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/mxnzp': ''
                }
            },
            '/apicdn': {
                target: 'http://apicdn.imo6.cn/',
                changeOrigin: true,
                pathRewrite: {
                    '^/apicdn': ''
                }
            },
            '/bidianer': {
                target: 'https://www.bidianer.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/bidianer': ''
                }
            },
            '/hitokoto': {
                target: 'https://v1.hitokoto.cn/',
                changeOrigin: true,
                pathRewrite: {
                    '^/hitokoto': ''
                }
            }

        }
    }
}