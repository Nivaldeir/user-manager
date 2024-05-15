import {
  userUpdatingByUserPermissionSchema,
  userFindSchema,
  userGetSchema,
  userSaveSchema,
  userUpdateSchema,
  userUpdatingByUserRoleSchema,
} from "./schema/UserSchema";
import HttpController from "./HttpController";
import { Request } from "express";
import Logger from "../infra/logger";
import Middlware from "./middleware";

export default class UserController extends HttpController {
  handle() {
    this.httpServer.on({
      method: "get",
      url: "/user",
      callback: this.find.bind(this)
    })
    this.httpServer.on({
      method: "post",
      url: "/user",
      callback: this.create.bind(this)
    });

    this.httpServer.on({
      method: "put",
      url: "/user/:id",
      callback: this.update.bind(this)
    });
    this.httpServer.on({
      method: "get",
      url: "/user/:id",
      callback: this.get.bind(this)
    });
    this.httpServer.on({
      method: "post",
      url: "/user/check-permission",
      callback: this.checkPermission.bind(this)
    });
    this.httpServer.on({
      method: "put",
      url: "/user/:userId/deleting-permission",
      callback: this.deletePermissionForUser.bind(this)
    });
    this.httpServer.on({
      method: "put",
      url: "/user/:userId/adding-permission",
      callback: this.addingPermissionForUser.bind(this)
    });
    this.httpServer.on({
      method: "put",
      url: "/user/:userId/update-role",
      callback: this.updatingRoleForUser.bind(this)
    });
  }
  @Middlware.validateRequest(["update_users"])
  @Middlware.validateSchema(userUpdatingByUserPermissionSchema)
  async deletePermissionForUser(req: Request, res, next) {
    const output = await this.factory.userService.deleteByPermission({ ...req.body, ...req.params });
    res.status(200).send({
      message: "Sucesso",
      data: output,
    });
  }

  @Middlware.validateRequest(["update_users"])
  @Middlware.validateSchema(userUpdatingByUserPermissionSchema)
  async addingPermissionForUser(req: Request, res, next) {
    const output = await this.factory.userService.addingByPermission({ ...req.body, ...req.params });
    res.status(200).send({
      message: "Sucesso",
      data: output,
    });
  }
  @Middlware.validateRequest(["update_users"])
  @Middlware.validateSchema(userUpdatingByUserRoleSchema)
  async updatingRoleForUser(req: Request, res, next) {
    const output = await this.factory.userService.updateForRoleUser({ ...req.body, ...req.params });
    res.status(200).send({
      message: "Sucesso",
      data: output,
    });
  }
  @Middlware.validateSchema(userFindSchema)
  @Middlware.validateRequest(["find_user"])
  async find(req: any, res, next) {
    const output = await this.factory.userService.find(req.query);
    res.status(200).send({
      message: "Sucesso",
      data: output,
    });
  }

  @Middlware.validateSchema(userSaveSchema)
  async create(req: Request, res, next) {
    console.log(req.session)
    const {
      email,
      password,
      username,
      id,
    } = req.body;
    const output = await this.factory.userService.save({
      email,
      password,
      username,
      id,
    });
    res.status(201).send({
      message: "Sucesso",
      data: output,
    });
  }

  @Middlware.validateRequest(["update_user"])
  @Middlware.validateSchema(userUpdateSchema)
  async update(req: Request, res, next) {
    const { id } = req.params;
    const { email, password, username, enabled, roleId } = req.body;
    const output = await this.factory.userService.update({
      id,
      email,
      password,
      enabled,
      username,
      roleId,
    });
    res.send({
      message: "Sucesso",
      data: output,
    });
  }

  @Middlware.validateRequest(["get_user"])
  @Middlware.validateSchema(userGetSchema)
  async get(req: Request, res, next) {
    const { id } = req.params;
    const output = await this.factory.userService.findById(id);
    res.send({
      message: "Sucesso",
      data: output,
    });
  }
  async checkPermission(req, res) {
    const { token, requiredPermission } = req.body;
    try {
      const user = this.factory.tokenService.verify(token) as any
      const userPermissions = user.permissions as any;
      const hasPermission = userPermissions.includes(requiredPermission);
      res.send({ hasPermission });
    } catch (error) {
      Logger.instance.error(error)
      res.status(401).send({ isAccessed: false });
    }
  }
}
