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
        if (obj1 === obj2) {
            return true
        }

        if (typeof obj1 === 'object' && typeof obj1 === typeof obj2 && obj1.constructor === obj2.constructor) {
            if (obj1.valueOf() === obj2.valueOf()) {
                return true
            }

            if (Array.isArray(obj1) && Array.isArray(obj2)) {
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

            var keyCount1,
                keyCount2

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
        }

        return true
    }

    var test = {
        describe: function(descript, func) {
            console.log(descript)
            try {
                func()
            } catch (e) {
                console.error(e.message)
            }
        },
        assert: function(expression, message) {
            console.assert.apply(console, arguments)
        },
        assertEqual: function(obj1, obj2) {
            var equal = obj1 === obj2
            this.assert(equal, 'obj1 不等于 obj2')
        },
        assertSimilarEqual: function(obj1, obj2) {
            /// <summary>判断两个对象是否相似</summary>
            //如[1,2,3] 与[1,2,3]相似

            var equal = similarEqual(obj1, obj2)

            this.assert(equal, 'obj1 不等于 obj2')
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
