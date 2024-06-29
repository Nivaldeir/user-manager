import request  from 'supertest'
import "../../src/main"
import server from "../../src/infra/api/index"
describe("Login Auth API", () => {
  const http = request(server.app)
  const inputCreate = {
    "email": "teste@teste.com",
    "password":"123456",
    "username": "test"
  }
  test("GET /auth/report/:id", async ()=>{
    await http.post("/user").send(inputCreate)
    const authResponse = await (await http.post("/auth/sign-in").send(inputCreate).expect(200)).body
    await http.patch('/user/'+ authResponse.data.user.id).set('Authorization', `Bearer ${authResponse.data.token}`).send({
      permissions: {id: "a1a44888-95e3-4ad4-a2e4-d334e7b6c4ba",
      name: "GET_LOGIN_AUDIT"}
    })
    await http.get('/auth/report/'+authResponse.data.user.id).set('Authorization', `Bearer ${authResponse.data.token}`).expect(200)
  })
})