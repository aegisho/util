(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['core'], factory)
    } else {
        factory()
    }
}(function () {
    'use strict'

    newsee.namespace('util', newsee).string = {
        template: function (str) {
            /// <summary>格式化字符串</summary>
            var args = arguments[1],
                result = str

            if (typeof args !== 'object') {
                args = Array.prototype.slice.call(arguments, 1)
            }
            if (args) {
                result = str.replace(/\{([^{}]+)\}/g, function (str, key) {
                    var value = str
                    if (args.hasOwnProperty(key)) {
                        value = args[key]
                        if (value == null) {
                            value = ''
                        }
                    }
                    return value
                })
            }
            return result
        },
        templateList: function (str, list, func) {
            var arr = list.map(function (item, index) {
                if (func) {
                    func.apply(item, arguments)
                }
                return this.template(str, item)
            }, this)

            return arr.join('')
        },
        obj2str: function (obj, format, separator) {
            /// <summary>按照特定格式转换字符串</summary>
            if (separator == undefined) {
                separator = ','
            }

            var type = typeof obj,
                result = []

            if (type === 'object') {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        result.push(this.template(format, key, obj[key]))
                    }
                }
            } else if (type === 'string') {
                result = [obj]
            }

            return result.join(separator)
        },
        toShort: function (str, len) {
            if (str && str.length > len) {
                return str.substr(0, len) + '..'
            }
            return str
        }
    }

    return newsee
}))