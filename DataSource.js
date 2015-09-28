//数据处理
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['core', 'jquery'], factory)
    } else {
        factory()
    }
} (function (core, $) {
    'use strict'

    //模拟数据预加载
    function PreLoad(options, ajaxdata) {
        this.init(options, ajaxdata)
        this.loadTime = 0
    }

    PreLoad.prototype = {
        constructor: PreLoad,
        init: function (options, ajaxdata) {
            var value = { data: [], count: 0 },
                mock = options

            if (options.mock) {
                mock = options.mock
            }

            if (typeof mock === 'function') {
                mock = mock(ajaxdata)
            }

            if (mock instanceof Array) {
                value = {
                    data: mock,
                    count: mock.length
                }
            } else if (mock.data && mock.count) {
                value = mock
            }

            this.mock = value
            this.times = options.times || 1
        },
        load: function (func) {
            var mock = this.mock
            if (mock && (this.times === 'always' || this.loadTime < this.times)) {
                func(mock.data, mock.count, true)
                this.loadTime++
            }
        }
    }

    //缓存
    function Cache() {

    }

    Cache.prototype = {
        constructor: Cache,
        add: function (key, data) {
            this[key] = data
        },
        get: function (key) {
            return this[key]
        },
        remove: function (key) {
            if (key) {
                delete this[key]
            } else {
                this.remove()
            }
        },
        clear: function () {
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    delete this[key]
                }
            }
        },
        update: function (func, key) {
            //更新缓存，如果存在parse函数，请手动执行
            var data
            if (key) {
                data = this[key]
                func.call(this, data)
            } else {
                for (var key in this) {
                    if (this.hasOwnProperty(key)) {
                        data = this[key]
                        func.apply(this, data)
                    }
                }
            }
        }
    }

    function DataSource(options) {
        /// <summary>数据集</summary>
        /// <param name="options" type="Object">参数</param>

        var config = {
            cache: true,    //查询缓存            
            preload: false, //预加载
            parse: null     //数据处理 parse应该是幂等函数
        }

        core.mixin(config, options)
        core.mixin(this, config)

        if (this.cache) {
            this.cache = new Cache()
        }
    }

    DataSource.prototype = {
        constructor: DataSource,
        setOptions: function (options) {
            core.mixin(this, options)
        },
        ajax: function (options, fields) {
            var successFunc = options.success,
                key

            //使用查询条件作为缓存key
            if (this.cache) {
                key = JSON.stringify(options.data)
            }

            options.success = function () {

                //处理函数 如果为缓存的数据，不再使用parse
                if (this.parse && !this.cache.get(key)) {
                    this.parse.apply(null, arguments)
                }

                successFunc.apply(null, arguments)

                //添加缓存             
                if (this.cache) {
                    //预加载不加入到缓存中
                    var isPreload = arguments[2]
                    if (!isPreload) {
                        this.cache.add(key, Array.prototype.slice.call(arguments))
                    }
                }
            }.bind(this)

            //预加载模式
            if (this.preload) {
                if (!(this.preload instanceof PreLoad)) {
                    this.preload = new PreLoad(this.preload, options.data)
                }
                this.preload.load(options.success)
            }

            //使用缓存
            if (this.cache) {
                var data = this.cache.get(key)
                if (data) {
                    return options.success.apply(null, data)
                }
            }

            return $.ajax(options)
        }
    }

    return DataSource
}))