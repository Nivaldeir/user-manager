import { roleSaveSchema, roleUpdateSchema, roleUpdatingPermissionSchema } from "./schema/RoleSchema";
import HttpController from "./HttpController";
import Middlware from "./middleware";
import { Request } from "express";

export default class RoleController extends HttpController {
  handle() {
    this.httpServer.on({
      method: "get",
      url: "/role/:id",
      callback: this.get.bind(this)
    });
    this.httpServer.on({
      method: "post",
      url: "/role",
      callback: this.create.bind(this)
    });
    this.httpServer.on({
      method: "put",
      url: "/role/:id",
      callback: this.update.bind(this)
    });
    this.httpServer.on({
      method: "get",
      url: "/role",
      callback: this.find.bind(this)
    });
    this.httpServer.on({
      method: "delete",
      url: "/role/:roleId",
      callback: this.delete.bind(this)
    });
    this.httpServer.on({
      method: "get",
      url: "/role/permission",
      callback: this.getByPermission.bind(this)
    });
    this.httpServer.on({
      method: "put",
      url: "/role/:roleId/deleting-permission",
      callback: this.deletePermissionForUser.bind(this)
    });
    this.httpServer.on({
      method: "put",
      url: "/role/:roleId/adding-permission",
      callback: this.addingPermissionForUser.bind(this)
    });
  }

  @Middlware.validateRequest(["get_role"])
  async get(req, res, next) {
    const { id } = req.params;
    const output = await this.factory.roleService.findByUnique(id);
    res
      .send({
        message: "Sucesso",
        data: output,
      })
      .status(200);
  }
  @Middlware.validateRequest(["create_role"])
  @Middlware.validateSchema(roleSaveSchema)
  async create(req, res, next) {
    const { name } = req.body;
    const output = await this.factory.roleService.save({
      name
    });
    res
      .send({
        message: "Sucesso",
        data: output,
      })
      .status(200);
  }
  @Middlware.validateRequest(["update_role"])
  @Middlware.validateSchema(roleUpdateSchema)
  async update(req, res, next) {
    const { id } = req.params;
    const { name } = req.body;
    const output = await this.factory.roleService.update({ id, name });
    res
      .send({
        message: "Sucesso",
        data: output,
      })
      .status(200);
  }
  @Middlware.validateRequest(["find_role"])
  async find(req, res, next) {
    const output = await this.factory.roleService.find();
    res
      .send({
        message: "Sucesso",
        data: output,
      })
      .status(200);
  }
  @Middlware.validateRequest(["find_role"])
  async getByPermission(req, res, next) {
    const output = await this.factory.permissionService.connectToRole({
      idPermission: req.params.id,
      nameRole: req.body.name,
    });
    res
      .send({
        message: "Sucesso",
        data: output,
      })
      .status(200);
  }
  @Middlware.validateRequest(["update_role"])
  @Middlware.validateSchema(roleUpdatingPermissionSchema)
  async deletePermissionForUser(req: Request, res, next) {
    const output = await this.factory.roleService.deleteByPermission({ ...req.body, ...req.params });
    res.status(200).send({
      message: "Sucesso",
      data: output,
    });
  }

  @Middlware.validateRequest(["update_role"])
  @Middlware.validateSchema(roleUpdatingPermissionSchema)
  async addingPermissionForUser(req: Request, res, next) {
    console.log(req.body)
    console.log(req.params)
    const output = await this.factory.roleService.addingByPermission({ ...req.body, ...req.params });
    res.status(200).send({
      message: "Sucesso",
      data: output,
    });
  }
  @Middlware.validateRequest(["update_role"])
  async delete(req, res, next) {
    const { roleId } = req.params;
    const output = await this.factory.roleService.delete(roleId);
    res
      .send({
        message: "Sucesso",
        data: output,
      })
      .status(200);
  }
}
