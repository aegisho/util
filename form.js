//表单处理
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['core'], factory)
    } else {
        factory($, core)
    }
}(function ($, core) {
    'use strict'

    var form = {
        bind: function (data, contain, otherType) {
            /// <summary>绑定表单</summary>
            /// <param name="data" type="Object">实体对象</param>
            /// <param name="contain" type="El">容器</param>      

            var key,
                item,
                bindType = 'input,select,textarea' + (otherType ? ',' + otherType : '')
                inputs = (contain || document).querySelectorAll(bindType)

            inputs.forEach(function (input) {
                var name = input.name || input.id,
                    type = input.type,
                    value,
                    i,
                    len,
                    option

                if (!name || !core.hasKey(data, name)) {
                    return true
                }

                value = core.findValue(data, name) || ''

                switch (type) {
                    case 'select-multiple':
                        input.options.forEach(function(option){
                            option.selected = value.split(',').indexOf(option.value) > -1
                        })                        
                        break
                    case 'checkbox':
                    case 'radio':
                        input.checked = (',' + value + ',').indexOf(',' + input.value + ',') > -1
                        break
                    default:
                        if ('value' in input) {
                            input.value = value
                        } else {
                            input.innerHTML = value
                        }
                        break
                }

            })
        },
        serialize: function (contain, encode) {
            /// <summary>表单序列化</summary>
            /// <param name="$contain" type="$">容器</param>
            /// <param name="encode" type="Boolean">编码</param>

            var fields = (contain || document).querySelectorAll('input,select,textarea'),
                obj = {}

            fields.forEach(function (input) {
                var name = input.name || input.id,
                    type = input.type,
                    value

                if (!name || input.getAttribute('noserialize') != null) {
                    continue
                }
                
                if('value' in input){
                    value = input.value 
                }

                if (encode) {
                    value = encodeURIComponent(value || '')
                }

                switch (input.type) {
                    case 'select-multiple':
                        value = input.options.map(function(option){
                            return option.selected ? option.value : ''
                        }).join(',')                      
                    case 'checkbox':
                    case 'radio':
                        if (!input.checked) {
                            break
                        }
                    default:
                        var temp = obj
                        if (name.indexOf('.') > -1) {
                            temp = core.namespace(name, obj, true)
                            name = name.split('.').pop()
                        }
                        temp[name] = temp[name] ? temp[name] + ',' + value : value
                }
            })

            return obj
        }
    }

    return form
}))