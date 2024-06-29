import request  from 'supertest'
import "../../src/main"
import server from "../../src/infra/api/index"
let http = request(server.app)
describe("User API", () => {
  const inputCreate = {
    "email": "teste@teste.com",
    "password":"123456",
    "username": "test"
  }
  test("POST /user", async ()=>{
   const response = await (await http.post("/user").send(inputCreate).expect(201)).text as any
   let output = JSON.parse(response)

    expect(output.message).toBe("Sucesso")
  })

  test("GET /user", async ()=>{
    const output = await (await http.post("/auth/sign-in").send(inputCreate).expect(200)).body
    const response =  (await http.get("/user").set('Authorization', `Bearer ${output.data.token}`)).body

    expect(response.message).toBe("Sucesso")
    expect(response.data[0].active).toBeDefined()
    expect(response.data[0].email).toBeDefined()
    expect(response.data[0].id).toBeDefined()
    expect(response.data[0].username).toBeDefined()
  })

  test("DELETE /user/:id", async ()=>{
    const authResponse = await (await http.post("/auth/sign-in").send(inputCreate).expect(200)).body
    const response = await (await http.delete(`/user/${authResponse.data.user.id}`).set('Authorization', `Bearer ${authResponse.data.token}`)).body

    expect(response.message).toBe("Sucesso")
  })

  test("PATCH /user/:id", async ()=>{
    const authResponse = await (await http.post("/auth/sign-in").send(inputCreate).expect(200)).body
    const response = await (await http.patch(`/user/${authResponse.data.user.id}`).set('Authorization', `Bearer ${authResponse.data.token}`))

    expect(response.error).toBeDefined()
  })

  beforeEach((): void => {
    jest.setTimeout(60000);
  });
})