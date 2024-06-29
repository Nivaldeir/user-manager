import request  from 'supertest'
import "../../src/main"
import server from "../../src/infra/api/index"
import { randomUUID } from 'crypto'
describe("Auth API", () => {
  const http = request(server.app)
  const inputCreate = {
    "email": randomUUID()+"@teste.com",
    "password":"123456",
    "username": "test"
  }
  test("POST /permission", async ()=>{
    await http.post("/user").send(inputCreate)
    const authResponse = await (await http.post("/auth/sign-in").send({ email: inputCreate.email, password: inputCreate.password })).body
    await http.patch("/user/"+authResponse.data.user.id).set('Authorization', `Bearer ${authResponse.data.token}`).send({permissions: {
      id:"80ed0903-7ee8-42a4-bd3b-e8e6d05964b6",
      name:"CREATE_PERMISSION",
    } })
   await http.post("/permission").set('Authorization', `Bearer ${authResponse.data.token}`).send({name: "NEW_PERMISSION"}).expect(200)
  })
  
  test("PUTCH /permission/:id", async ()=>{
    await http.post("/user").send(inputCreate)
    const authResponse = await (await http.post("/auth/sign-in").send({ email: inputCreate.email, password: inputCreate.password })).body
    await http.patch("/user/"+authResponse.data.user.id).set('Authorization', `Bearer ${authResponse.data.token}`).send({permissions: {
      id:"80ed0903-7ee8-42a4-bd3b-e8e6d05964b6",
      name:"CREATE_PERMISSION",
    } })
    await http.patch("/user/"+authResponse.data.user.id).set('Authorization', `Bearer ${authResponse.data.token}`).send({permissions: {
      id:"8ebec505-8059-4bdc-b222-75a5e665e985",
      name:"FIND_PERMISSION",
    } })
    await http.patch("/user/"+authResponse.data.user.id).set('Authorization', `Bearer ${authResponse.data.token}`).send({permissions: {
      id:"a5ad1bd9-1471-4711-ba32-97ca2685f816",
      name:"UPDATE_PERMISSION",
    } })
    const permission = await (await http.post("/permission").set('Authorization', `Bearer ${authResponse.data.token}`).send({name: "NEW_PERMISSION"})).body as any
    await http.patch("/permission/"+permission.data.id).set('Authorization', `Bearer ${authResponse.data.token}`).send({name: "NEW_PERMISSION_UPDATE"}).expect(200)
  })
  test("DELETE /permission/:id", async ()=>{
    await http.post("/user").send(inputCreate)
    const authResponse = await (await http.post("/auth/sign-in").send({ email: inputCreate.email, password: inputCreate.password })).body
    await http.patch("/user/"+authResponse.data.user.id).set('Authorization', `Bearer ${authResponse.data.token}`).send({permissions: {
      id:"506a1a6c-de68-4ad3-afd0-03b7c539f6cd",
      name:"DELETE_PERMISSION",
    } })
    await http.patch("/user/"+authResponse.data.user.id).set('Authorization', `Bearer ${authResponse.data.token}`).send({permissions: {
      id:"80ed0903-7ee8-42a4-bd3b-e8e6d05964b6",
      name:"CREATE_PERMISSION",
    } })
    const permission = await (await http.post("/permission").set('Authorization', `Bearer ${authResponse.data.token}`).send({name: "NEW_PERMISSION"})).body as any
     await http.delete("/permission/"+permission.data.id).set('Authorization', `Bearer ${authResponse.data.token}`).expect(200)
  })
})