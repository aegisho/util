(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['core'], factory)
    } else {
        factory()
    }
}(function() {
    'use strict'

    var decode = function(value) {
        var result = value
        try {
            result = decodeURIComponent(value)
        } catch (e) {

        }
        return result
    }

    var urlUtil = {
        getQuery: function(name, url) {
            /// <summary>获取url参数</summary>
            var search = url ? url.split('?')[1] : location.search.substr(1)

            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
                match = search.match(reg),
                result = ''

            result = decode(match ? match[2] : '')
            return result
        },
        composeUrl: function(obj) {
            /// <summary>组装键值对数组到url参数</summary>
            /// <param name="obj" type="Object">键值对数组</param>

            var key, item, result = []
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    item = obj[key]
                    if (item !== '' && item != null) {
                        result.push(key + '=' + encodeURIComponent(item))
                    }
                }
            }
            return result.join('&')
        },
        back2from: function(query, name) {
            name = name || 'from'
            var from = this.getQuery(name)
            if (from) {
                from = this.replaceQuery(from, query)
                location.href = decode(from)
            } else {
                history.back()
            }
        },
        replaceQuery: function(url, obj) {
            /// <summary>替换参数</summary>

            var temp = url.split('?'),
                url = temp[0],
                search = temp[1],
                obj = obj || {}

            if (search) {
                search.split('&').forEach(function(item) {
                    var arr = item.split('='),
                        key = arr[0],
                        value = arr[1]

                    if (!obj[key]) {
                        try {
                            obj[key] = decode(value)
                        } catch (e) {
                            obj[key] = value
                        }
                    }
                })
            }
            return url + '?' + this.composeUrl(obj)
        },
        getBaseUrl: function() {
            /// <summary>获取项目的根目录</summary>

            var baseUrl = localStorage.baseUrl
            if (!baseUrl) {
                var scripts = document.getElementsByTagName('script'),
                    src,
                    index,
                    url,
                    i,
                    len

                for (i = 0, len = scripts.length; i < len; i++) {
                    src = scripts[i].src
                    index = src.indexOf('url.js')
                    console.warn('请使用实际地址替换')
                    if (index > -1) {
                        url = src.substring(0, index)
                        break
                    }
                }
                baseUrl = localStorage.baseUrl = url
            }
            return baseUrl
        }
    }

    return urlUtil
}))
