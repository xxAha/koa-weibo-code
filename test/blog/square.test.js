/**
 * @description 广场页API test
 * @author 双越老师
 */

const server = require('../server')
const { Z_COOKIE } = require('../testUserInfo')

test('广场页，加载第一页数据，应该成功', async () => {
    const res = await server
        .get(`/api/square/loadMore/0`)
        .set('cookie', Z_COOKIE)
    expect(res.body.errno).toBe(0)

    const data = res.body.data
    expect(data).toHaveProperty('isEmpty')
    expect(data).toHaveProperty('blogList')
    expect(data).toHaveProperty('pageSize')
    expect(data).toHaveProperty('pageIndex')
    expect(data).toHaveProperty('count')
})
