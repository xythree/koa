const supertest = require('supertest')
const chai = require('chai')
const app = require(__dirname + '/../start')
const assert = chai.assert
const expect = chai.expect
const request = supertest(app.listen())


// 测试套件/组
describe( '开始测试demo的GET请求', ( ) => {

  // 测试用例
  it('测试/api/login请求', done => {
      request
        .post('/api/login')
        .expect(200)
        .send({name: "demoabc1", password: "aaaaaa"})
        .end(( err, res ) => {
            //断言判断结果是否为object类型
            expect(res.body).to.be.an('object')
            //expect(res.body).to.be.an('boolean')
            //expect(res.body).to.be.an('string')
            assert.equal(res.body, '返回结果');
            done(err)
        })
  })

  it("测试/api/register请求", done => {
    request
      .post("/api/register")
      .expect(200)
      .send({name: "demoabc1", password: "aaaaaa"})
      .end((err, res) => {
        assert.equal(res.body, "register 返回结果")
        done(err)
      })
  })

})




