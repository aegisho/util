if (!location.search) {
    location.search = '?id=1&name=测试'
}

require.config({
    baseUrl: '../'
})

require(['test'], function(test) {

    require(['url'], function(urlUtil) {
        console.log('url.js test begin')

        test.describe('url.getQuery', function() {
            var id = urlUtil.getQuery('id')
            test.assertEqual(id, '1')

            var name = urlUtil.getQuery('name')
            test.assertEqual(name, '测试')

            var other = urlUtil.getQuery('other')
            test.assertEqual(other, '')
        })

        test.describe('url.composeUrl', function() {
            var query = {
                id: 2,
                name: '测试2'
            }

            var queryStr = urlUtil.composeUrl(query)
            test.assertEqual(queryStr, 'id=2&name=' + encodeURIComponent('测试2'))
        })

        test.describe('url.replaceQuery', function() {
            var newUrl = urlUtil.replaceQuery(location.href, {
                id: 2,
                name2: '测试2'
            })

            var id = urlUtil.getQuery('id', newUrl),
                name = urlUtil.getQuery('name', newUrl),
                name2 = urlUtil.getQuery('name2', newUrl)

            test.assertEqual(id, '2')
            test.assertEqual(name, '测试')
            test.assertEqual(name2, '测试2')
        })

        console.log('url.js test begin')
    })

})
