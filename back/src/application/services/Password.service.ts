import * as crypto from 'crypto';
export default class PasswordService {
  hashPassword(password: string): { passwordHash: string, salt: string } {
    const saltRounds = crypto.randomBytes(20).toString("hex")
    const hashedPassword = crypto.pbkdf2Sync(password, saltRounds, 100, 64, "sha512").toString('hex');
    return {
      passwordHash: hashedPassword,
      salt: saltRounds
    };
  }

  verifyPassword(password: string, salt: string, hashedPassword: string): boolean {
    const isMatch = crypto.pbkdf2Sync(password, salt, 100, 64, "sha512").toString('hex');
    return isMatch === hashedPassword;
  }
}