import * as jwt from "jsonwebtoken";
export default class TokenService {
  generate(input: Input) {
    const token = jwt.sign(
      {
        ...input.body,
      },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: input.expiresIn }
    );
    return token;
  }
  verify(token: string) {
    const isValid = jwt.verify(token, process.env.JWT_SECRET);
    return isValid;
  }
}

type Input = {
  expiresIn: string;
  body: any;
};
