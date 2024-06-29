import * as jwt from 'jsonwebtoken'
export class Token {
  static generate(params: object){
    const token = jwt.sign(
      params,
     "123456",
      { algorithm: 'HS256', expiresIn: "7d" }
  )
  return token
  }
  static verify(token: string){
    try {
      const valid =  jwt.verify(token, "123456")
      return valid
    }catch (e){
      return false
    }
  }
}