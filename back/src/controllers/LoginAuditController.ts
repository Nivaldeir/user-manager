import HttpController from "./HttpController";
import Middlware from "./middleware";

export default class LoginAuditController extends HttpController {
  handle() {
    this.httpServer.on({
      method: "get",
      url: "/auth/report/:id",
      callback: this.get.bind(this)
    })
  }

  @Middlware.validateRequest(["get_login_audit"])
  async get(req, res, next) {
    const { id } = req.params;
    const output = await this.factory.loginAuditService.find(id)
    res.send({
      message: "Sucesso",
      data: output
    }).status(200)
  }
}