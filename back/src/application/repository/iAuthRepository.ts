export default interface IAuthRepository {
  signIn(input: Input): Promise<any>;
  recovery(email: string): Promise<any>
  updatePassword(token: string, newPassword: string): Promise<any>
}

type Input = {
  username?: string;
  email?: string;
  password: string;
  details: object;
};
