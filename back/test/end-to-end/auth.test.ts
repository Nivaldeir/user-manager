import request  from 'supertest'
import "../../src/main"
import server from "../../src/infra/api/index"
describe("Auth API", () => {
  const http = request(server.app)
  const inputCreate = {
    "email": "teste@teste.com",
    "password":"123456",
    "username": "test"
  }
  test("POST /auth/sign-in", async ()=>{
    await (await http.post("/user").send(inputCreate)).body
    const output = await (await http.post("/auth/sign-in").send(inputCreate).expect(200)).body

    expect(output.data.token).toBeDefined()
    expect(output.message).toBeTruthy()
  })
  
  test("POST /auth/sign should return access danied", async ()=>{
    await (await http.post("/user").send(inputCreate)).body
    const output = await (await http.post("/auth/sign-in").send(inputCreate).expect(200)).body
    await http.get(`/user/${output.data.user.id}`).set('Authorization', "").expect(403)
  })

})