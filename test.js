(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['core'], factory)
    } else {
        factory()
    }
}(function() {
    'use strict'

    function similarEqual(obj1, obj2) {
        /// <summary>判断两个对象是否相似</summary>

        var type1 = Object.prototype.toString.call(obj1),
            type2 = Object.prototype.toString.call(obj2)

        if (type1 !== type2) {
            return false
        }

        if (test.isEqual(obj1, obj2)) {
            return true
        }

        //日期比较
        if (obj1 instanceof Date) {
            return obj1.valueOf() === obj2.valueOf()
        }

        //数组比较
        if (Array.isArray(obj1)) {
            var i,
                len1 = obj1.length,
                len2 = obj2.length

            if (len1 != len2) {
                return false
            }

            for (i = 0; i < len1; i++) {
                if (!similarEqual(obj1[i], obj2[i])) {
                    return false
                }
            }
            return true
        }

        //对象比较
        if (typeof obj1 === 'object') {
            for (var key in obj1) {
                if (obj1.hasOwnProperty(key)) {
                    if (!similarEqual(obj1[key], obj2[key])) {
                        return false
                    }
                }
            }

            for (var key in obj2) {
                if (obj2.hasOwnProperty(key)) {
                    if (!similarEqual(obj1[key], obj2[key])) {
                        return false
                    }
                }
            }
            return true
        }

        throw '不支持比较' + type1 + '对象'
    }

    var test = {
        describe: function(descript, func) {
            console.log(descript)
            try {
                func()
            } catch (e) {
                console.error(descript + ' fail,error:' + e.message)
            }
        },
        assert: function(expression, message) {
            console.assert.apply(console, arguments)
        },
        isEqual: function(obj1, obj2) {
            var equal = obj1 === obj2

            //判断NaN
            if (!equal) {
                var type1 = typeof obj1,
                    type2 = typeof obj2

                equal = type1 === 'number' && type2 === 'number' && isNaN(obj1) && isNaN(obj2)
            }

            return equal
        },
        assertEqual: function(obj1, obj2) {
            var equal = this.isEqual(obj1, obj2)

            this.assert(equal, obj1 + ' 不等于 ' + obj2)
        },
        assertNotEqual: function(obj1, obj2) {
            var equal = !this.isEqual(obj1, obj2)
            this.assert(equal, obj1 + ' 等于 ' + obj2)
        },
        assertSimilarEqual: function(obj1, obj2) {
            /// <summary>判断两个对象是否相似</summary>
            //如[1,2,3] 与[1,2,3]相似

            var equal = similarEqual(obj1, obj2)

            this.assert(equal, obj1 + ' 不等于 ' + obj2)
        },
        getTime: function(times, func, args, thisArgs) {
            times = times || 1
            if (!(args instanceof Array)) {
                args = [args]
            }

            var date = new Date()
            for (var i = 0; i < times; i++) {
                func.apply(thisArgs, args)
            }
            return new Date() - date
        }
    }

    return test
}))
