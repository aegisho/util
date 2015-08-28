//核心函数库
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory)
    } else {
        factory()
    }
}(function () {
    'use strict'

    var core = {
        namespace: function (path, context) {
            /// <summary>创建命名空间</summary>
            /// <param name="path" type="String">路径</param>
            /// <param name="context" type="Object">上下文对象</param>
            context = context || window
            var keys = path.split('.'),
                item = context

            keys.forEach(function (name) {
                item = (name in item && typeof item[name] === 'object') ? item[name] : (item[name] = {})
            })

            return item
        },
        mixin: function (obj, src) {
            /// <summary>掺入属性</summary>
            /// <param name="obj" type="Object">目标对象</param>
            /// <param name="src" type="Object">掺入对象</param>
            if (obj == null || src == null || typeof obj !== 'object' || typeof src !== 'object') {
                return obj
            }

            if (src instanceof Array) {
                src.forEach(function (item) {
                    this.mixin(obj, item)
                }, this)
            }

            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    if (src[key] instanceof Array) {
                        obj[key] = src[key].slice()
                    } else if (typeof src[key] === 'object' && src[key] !== null) {
                        if (!(key in obj) || obj[key] == null || typeof obj[key] !== 'object') {
                            obj[key] = {}
                        }
                        this.mixin(obj[key], src[key])
                    } else {
                        obj[key] = src[key]
                    }
                }
            }
            return obj
        },
        hasKey: function (data, key) {
            /// <summary>判断对象是否存在键值</summary>
            /// <param name="key" type="String">键值,可以包含"."</param>
            if (data == null || typeof data !== 'object' || !key || typeof key !== 'string') {
                return false
            }

            var keys = key.split('.'),
                item = data,
                result = true

            keys.forEach(function (k) {
                if (item != null && typeof item === 'object' && k in item) {
                    item = item[k]
                } else {
                    return result = false
                }
            })

            return result
        },
        findValue: function (data, key) {
            /// <summary>获取对象指定键的值</summary>
            /// <summary>判断对象是否存在键值</summary>
            /// <param name="key" type="String">键值,可以包含"."</param>
            if (data == null || typeof data !== 'object' || !key || typeof key !== 'string') {
                return false
            }

            var keys = key.split('.'),
                item = data

            keys.forEach(function (k) {
                if (item != null && typeof item === 'object' && k in item) {
                    item = item[k]
                } else {
                    item = null
                    return false
                }
            })

            return item
        },
        setValue: function (data, key, value) {
            /// <summary>设置对象的属性</summary>
            /// <param name="key" type="String">属性名称，a.b.c.d</param>
            if (data == null || typeof data !== 'object' || !key || typeof key !== 'string') {
                return
            }

            var keys = key.split('.'),
                item = data,
                key = keys.pop()

            keys.forEach(function (name) {
                item = (name in item && typeof item[name] === 'object') ? item[name] : (item[name] = {})
            })

            item[key] = value

            return data
        },
        callFunc: function (funcName, context) {
            /// <summary>调用对象的方法</summary>      
            /// <param name="funcName" type="string">方法名称</param>
            /// <param name="context" type="Object"></param>

            context = context || window
            var func = typeof funcName === 'function' ? funcName : this.findItem(context, funcName)

            if (typeof func === 'function') {
                var args = [].slice.call(arguments, 2)
                try {
                    return func.apply(context, args)
                }
                catch (e) {
                    console.error(e)
                }
            }
        },
        isEmpty: function (obj) {
            /// <summary>判断对象是否为空</summary>
            if (obj == null) {
                return true
            }

            if (obj instanceof Array && obj.length === 0) {
                return true
            }

            for (var item in obj) {
                if (obj.hasOwnProperty(item)) {
                    return false
                }
            }
            return true
        },
        invert: function (obj) {
            /// <summary>对换键（keys）和值（values）</summary>
            if (obj == null || typeof obj !== 'object') {
                return
            }

            var data = {},
                key

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    data[obj[key]] = key
                }
            }
            return data
        },
        toKeyValue: function (obj, options) {
            /// <summary>将数组或者对象转换为指定的key-value数组</summary>
            /// <param name="options" type="Objecy">配置参数</param>
            var config = {
                keyName: 'Key',
                valueName: 'Value',
                map: function (value) {
                    return value
                }
            }

            this.mixin(config, options)

            if (obj instanceof Array) {
                return obj.map(function (text, index) {
                    var data = {}
                    data[config.keyName] = text
                    data[config.valueName] = config.map(index)
                    return data
                })
            }

            var arr = [],
                key

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var data = {}
                    data[config.keyName] = key
                    data[config.valueName] = config.map(obj[key])
                    arr.push(data)
                }
            }
            return arr
        },
        processBigArray: function (items, process) {
            /// <summary>批量处理大数组</summary>
            /// <param name="items" type="Array"></param>
            /// <param name="process" type="Function"></param>
            if (!items) {
                return
            }
            var todo = items.concat()
            (function () {
                var start = new Date()
                do {
                    process(todo.shift())
                }
                while (todo.length && (new Date() - start < 100))
                if (todo.length) {
                    setTimeout(arguments.callee, 25)
                }
            }())
        },
        throttle: function (func, delay, maxDelay) {
            /// <summary>函数节流</summary>
            var timer = null,
                start

            delay = delay || 200

            return function () {
                var context = this,
                    args = arguments,
                    current = +new Date()

                if (!start) {
                    start = current
                }

                timer && clearTimeout(timer)

                if (maxDelay > delay && current - start >= maxDelay) {
                    start = current
                    func.apply(context, arguments)
                } else {
                    timer = setTimeout(function () {
                        start = current
                        func.apply(context, arguments)
                    }, delay)
                }
            }
        }
    }

    return core
}))