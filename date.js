(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['core'], factory)
    } else {
        factory()
    }
}(function () {
    'use strict'

    var date = {
        parse: function (date) {
            if (typeof date === 'string') {
                //JSON日期格式
                if (date.indexOf('/Date(') === 0) {
                    date = parseInt(date.substr(6))
                    return new Date(date)
                }
                return new Date(date.replace(/-/g, '/'))
            }
            if (typeof date === 'number' || date instanceof Date) {
                return new Date(date)
            }
            return null
        },
        format: function (date, format) {
            date = this.parse(date)

            if (date instanceof Date) {
                format = format || 'yyyy-MM-dd'

                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "H+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds()
                };
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
                }

                for (var k in o) {
                    if (new RegExp('(' + k + ')').test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(('' + o[k]).length))
                    }
                }
                return format
            }
            return date
        },
        getRange: function (date, type, number) {
            /// <summary>获取日期范围</summary>
            /// <param name="number" type="Number">数量</param>
            date = this.parse(date)
            number = number || 1

            var begin, end

            switch (type) {
                case 'week':
                    var day = date.getDay() || 7

                    begin = new Date(date)
                    begin.setDate(begin.getDate() - day + 1)

                    end = new Date(begin)
                    end.setDate(end.getDate() + number * 7 - 1)
                    break
                case 'month':
                    var month = date.getMonth()

                    begin = new Date(date.getFullYear(), month, 1)

                    end = new Date(begin)
                    end.setMonth(month + number)
                    end.setDate(-1)
                    break
                case 'quarter':
                    var month = date.getMonth()

                    month = Math.floor(month / 3) * 3
                    
                    begin = new Date(date.getFullYear(), month, 1)

                    end = new Date(begin)
                    end.setMonth(month + number * 3)
                    end.setDate(-1)
                    break
                case 'year':
                    var year = date.getFullYear()

                    begin = new Date(year, 0, 1)

                    end = new Date(begin)
                    end.setFullYear(year + number)
                    end.setDate(-1)
                    break
                default:
                    begin = date
                    end = date
                    break
            }

            return { begin: begin, end: end }
        },
    }

    return date
}))