(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['core'], factory)
    } else {
        factory()
    }
}(function () {
    'use strict'

    var cookie = {
        getCookie: function (name) {
            var cname = name + '=',
                cookie = document.cookie,
                begin,
                end,
                value = ''

            if (cookie) {
                begin = cookie.indexOf(cname)
                if (begin != -1) {
                    begin += cname.length
                    end = cookie.indexOf(';', begin)
                    if (end == -1) {
                        end = cookie.length
                    }
                    value = decodeURIComponent(cookie.substring(begin, end))
                }
            }
            return value
        },
        setCookie: function (name, value, domain, path, maxAge) {
            var cookie = name + '=' + encodeURIComponent(value),
                date

            if (maxAge) {
                date = new Date()
                date.setTime(date.getTime() + maxAge)                
                cookie += ';expires=' + date.toGMTString()
            }

            cookie += ';path=' + (path || '/')

            if (domain) {
                cookie += ';domain=' + domain + ';';
            }
            cookie += ';'
            document.cookie = cookie
        },
        deleteCookie: function (key) {
            this.setCookie(key, '', '', '', -1)
        }
    }

    return cookie
}))