import { Token } from "../../src/core/domain/use_cases/token"

describe("Token", () => {
  const input = {
    email: "email@example.com",
    id: "123",
  }
  test("should generate a token", () => {
    const token = Token.generate(input)
    expect(token).toBeDefined()
  })
  test("should generate token and return true ", () => {
    const token = Token.generate(input)
    expect(Token.verify(token)).toBeTruthy()
  })

  test("should generate token and return error ", () => {
    expect( () =>  Token.verify('sdawdadwa')).toThrow('Token invalid');
  })
})