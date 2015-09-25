require.config({
    baseUrl: '../'
})

require(['test'], function(test) {

    require(['core'], function(core) {
        console.log('core.js test begin')

        test.describe('core.namespace', function() {
            var book = {}
            core.namespace('anthor', book)
            test.assert('anthor' in book)

            book = {}
            core.namespace('anthor.name', book)
            test.assert(book.anthor && 'name' in book.anthor)

            book = {
                anthor: {
                    name: 'jone'
                }
            }
            core.namespace('anthor.sex', book)
            test.assert('sex' in book.anthor)
        })

        test.describe('core.mixin', function() {
            var book = {}
            var src = {
                anthor: {
                    name: 'jone',
                    sex: 'male'
                }
            }

            core.mixin(book, src)
            test.assertEqual(book.anthor.name, 'jone')
            test.assertNotEqual(book.anthor, src.anthor)
        })

        test.describe('core.hasKey', function() {
            var book = {
                anthor: {
                    name: 'jone',
                    sex: 'male'
                }
            }

            test.assert(core.hasKey(book, 'anthor'))
            test.assert(core.hasKey(book, 'anthor.sex'))
            test.assert(!core.hasKey(book, 'title'))
        })

        test.describe('core.findValue', function() {
            var book = {
                title: 'my book',
                anthor: {
                    name: 'jone',
                    sex: 'male'
                }
            }

            test.assertEqual(core.findValue(book, 'title'), 'my book')
            test.assertEqual(core.findValue(book, 'anthor.sex'), 'male')
            test.assertEqual(core.findValue(book, 'anthor.phone'), null)
        })

        test.describe('core.setValue', function() {
            var book = {
                title: 'my book'
            }

            var newTitle = 'new book'

            core.setValue(book, 'title', newTitle)
            test.assertEqual(book.title, newTitle)

            var newPhone = '0576-105-125'
            core.setValue(book, 'anthor.phone', newPhone)
            test.assertEqual(book.anthor.phone, newPhone)
        })

        test.describe('core.callFunc', function() {
            var book = {
                title: 'my book',
                anthor: {
                    name: 'jone',
                    getAnthorInfo: function(str) {
                        return this.name + (str || '')
                    }
                }
            }

            var reuslt = core.callFunc('anthor.getAnthorInfo', book, ' is anthor')

            test.assertEqual(reuslt, 'jone is anthor')
        })

        test.describe('core.isEmpty', function() {
            var obj = {
                name: ''
            }

            test.assert(!core.isEmpty(obj))

            var arr = [1]

            test.assert(!core.isEmpty(arr))

            var emptyObj = {}
            test.assert(core.isEmpty(emptyObj))

            var emptyArr = []
            test.assert(core.isEmpty(emptyArr))
        })

        test.describe('core.invert', function() {
            var obj = {
                name: 'jone'
            }

            var invertObj = core.invert(obj)

            test.assertSimilarEqual(invertObj, {
                jone: 'name'
            })
        })

        test.describe('core.toKeyValue', function() {
            var arr = ['One', 'Two', 'Three']

            var result = core.toKeyValue(arr, {
                map: function(value) {
                    return value === 6 ? 0 : (value + 1)
                }
            })

            test.assertSimilarEqual(result, [{
                Key: 'One',
                Value: 1
            }, {
                Key: 'Two',
                Value: 2
            }, {
                Key: 'Three',
                Value: 3
            }])
        })

        console.log('core.js test end')
    })

})