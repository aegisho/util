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
            test.assert(book.anthor.name === 'jone')
            test.assert(book.anthor !== src.anthor)
        })

        console.log('core.js test end')
    })
})
