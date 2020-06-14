module.exports = {
    publicPath: '/JK',
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
    }, devServer: {
        port: 9090,
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