import {
    permissionSaveSchema,
    permissionUpdateSchema,
} from './schema/PermissionSchema'
import HttpController from './http-controller'
import Middlware from './middleware'
import { NextFunction, Request, Response } from 'express'

export default class PermissionController extends HttpController {
    handle() {
        this.httpServer.on({
            method: 'post',
            url: '/permission',
            callback: this.create.bind(this),
        })
        this.httpServer.on({
            method: 'patch',
            url: '/permission/:id',
            callback: this.update.bind(this),
        })
        this.httpServer.on({
            method: 'get',
            url: '/permission/:id',
            callback: this.find.bind(this),
        })
        this.httpServer.on({
            method: 'delete',
            url: '/permission/:id',
            callback: this.delete.bind(this),
        })
    }


    @Middlware.validateRequest(['FIND_PERMISSION'])
    async find(req: Request, res: Response, next: NextFunction) {
        const output = await this.factory.findPermissions.execute({
            id: req.params.id
        })
        res.status(200).send({
            message: 'Sucesso',
            data: output,
        })
    }
    @Middlware.validateRequest(['create_permission'])
    @Middlware.validateSchema(permissionSaveSchema)
    async create(req: Request, res: Response, next: NextFunction) {
        const { name } = req.body
        const output = await this.factory.createPermissions.execute({ name })
        res.send({
            message: 'Sucesso',
            data: output,
        }).status(201)
    }
    @Middlware.validateRequest(['update_permission'])
    @Middlware.validateSchema(permissionUpdateSchema)
    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { name } = req.body
        const output = await this.factory.updatePermissions.execute({
            id,
            name,
        })
        res.status(200).send({
            message: 'Sucesso',
            data: output,
        })
    }
    @Middlware.validateRequest(['delete_permission'])
    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const output = await this.factory.deletePermission.execute({id})
        res.status(200).send({
            message: 'Sucesso',
            data: output,
        })
    }
}
