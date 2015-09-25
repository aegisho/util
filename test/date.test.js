require.config({
    baseUrl: '../'
})

require(['test'], function(test) {

    require(['date'], function(dateUtil) {
        console.log('date.js test begin')

        test.describe('date.parse', function() {
            var today = new Date(2015, 8, 25)

            var date = dateUtil.parse(today)
            test.assertSimilarEqual(date, today)

            date = dateUtil.parse('2015-9-25')
            test.assertSimilarEqual(date, today)

            date = dateUtil.parse('/Date(1443110400000)/')
            test.assertSimilarEqual(date, today)

            date = dateUtil.parse('Invalid Date')
            test.assertEqual(date.valueOf(), NaN)
        })

        test.describe('date.format', function() {
            var date = new Date(2015, 8, 25, 14, 30)

            var datestr = dateUtil.format(date)
            test.assertEqual(datestr, '2015-09-25')

            datestr = dateUtil.format(date, 'yyyy-M-dd HH:mm')
            test.assertEqual(datestr, '2015-9-25 14:30')
        })

        test.describe('date.getRange', function() {
            var date = new Date(2015, 8, 25)

            var range = dateUtil.getRange(date, 'week', 2)
            test.assertSimilarEqual(range.begin, new Date(2015, 8, 21))
            test.assertSimilarEqual(range.end, new Date(2015, 9, 4))

            range = dateUtil.getRange(date, 'month', 2)
            test.assertSimilarEqual(range.begin, new Date(2015, 8, 1))
            test.assertSimilarEqual(range.end, new Date(2015, 9, 30))


            range = dateUtil.getRange(date, 'quarter', 2)
            test.assertSimilarEqual(range.begin, new Date(2015, 6, 1))
            test.assertSimilarEqual(range.end, new Date(2015, 11, 30))

            range = dateUtil.getRange(date, 'year', 2)
            test.assertSimilarEqual(range.begin, new Date(2015, 0, 1))
            test.assertSimilarEqual(range.end, new Date(2016, 11, 30))
        })

        console.log('date.js test begin')
    })

})
