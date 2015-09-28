require.config({
    baseUrl: '../'
})

require(['test'], function (test) {

    require(['cookie'], function (cookieUtil) {
        console.log('cookie.js test begin')

        var cookie = cookieUtil.getCookie('test')
        test.assertEqual(cookie, '')

        cookieUtil.setCookie('test', 'test')
        cookie = cookieUtil.getCookie('test')
        test.assertEqual(cookie, 'test')

        cookieUtil.deleteCookie('test')
        cookie = cookieUtil.getCookie('test')
        test.assertEqual(cookie, '')

        console.log('cookie.js test end')
    })

})