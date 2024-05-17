import HttpController from "./HttpController";
import * as geoip from "geoip-lite";
import {
  recoveryNewPasswordSchema,
  recoverySchema,
  signInSchema,
} from "./schema/AuthSchema";
import Middlware from "./middleware";
export default class AuthController extends HttpController {
  handle() {
    this.httpServer.on({
      method: "post",
      url: "/auth/sign-in",
      callback: this.signIn.bind(this),
    });

    this.httpServer.on({
      method: "post",
      url: "/auth/recovery",
      callback: this.recovery.bind(this),
    });

    this.httpServer.on({
      method: "post",
      url: "/auth/recovery/:token",
      callback: this.updatePassword.bind(this),
    });
  }
  private getLocationFromIP(ip: string) {
    const geoData = geoip.lookup(ip);
    if (geoData) {
      return {
        city: geoData.city,
        region: geoData.region,
        country: geoData.country,
        ll: geoData.ll,
      };
    }
    return null;
  }
  @Middlware.validateSchema(signInSchema)
  async signIn(req, res, next) {
    const { email, username, password } = req.body;
    console.log(req.body);
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const detailsLogin = {
      ip: ipAddress,
      device: req.headers["user-agent"],
      location: this.getLocationFromIP(ipAddress as string),
    } as any;
    const { token, user } = await this.factory.authService.signIn({
      password,
      email,
      username,
      details: detailsLogin,
    });
    res
      .json({
        message: "Sucesso",
        data: { token, user },
      })
      .status(200);
    return;
  }
  @Middlware.validateSchema(recoverySchema)
  async recovery(req, res, next) {
    const { email } = req.body;
    await this.factory.authService.recovery(email);
    res
      .send({
        message: "Sucesso",
      })
      .status(200);
  }
  @Middlware.validateSchema(recoveryNewPasswordSchema)
  async updatePassword(req, res, next) {
    const { token } = req.params;
    const { password } = req.body;
    await this.factory.authService.updatePassword(token, password);
    res
      .send({
        message: "Sucesso",
      })
      .status(200);
  }
}
