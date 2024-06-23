import {
    permissionSaveSchema,
    permissionUpdateSchema,
} from './schema/PermissionSchema'
import HttpController from './HttpController'
import Middlware from './middleware'

export default class PermissionController extends HttpController {
    handle() {
        this.httpServer.on({
            method: 'get',
            url: '/permission',
            callback: this.find.bind(this),
        })

        this.httpServer.on({
            method: 'get',
            url: '/permission/:id',
            callback: this.get.bind(this),
        })

        this.httpServer.on({
            method: 'post',
            url: '/permission',
            callback: this.create.bind(this),
        })
        this.httpServer.on({
            method: 'put',
            url: '/permission/:id',

            callback: this.update.bind(this),
        })

        this.httpServer.on({
            method: 'delete',
            url: '/permission/:id',
            callback: this.delete.bind(this),
        })
    }

    @Middlware.validateRequest(['find_permission'])
    async find(req, res, next) {
        const output = await this.factory.permissionService.find()
        res.send({
            message: 'Sucesso',
            data: output,
        }).status(200)
    }

    @Middlware.validateRequest(['get_permission'])
    async get(req, res, next) {
        const { id } = req.params
        const output = await this.factory.permissionService.findByUnique(id)
        res.send({
            message: 'Sucesso',
            data: output,
        }).status(200)
    }

    @Middlware.validateRequest(['create_permission'])
    @Middlware.validateSchema(permissionSaveSchema)
    async create(req, res, next) {
        const { name } = req.body
        const output = await this.factory.permissionService.save({ name })
        res.send({
            message: 'Sucesso',
            data: output,
        }).status(200)
    }
    @Middlware.validateRequest(['update_permission'])
    @Middlware.validateSchema(permissionUpdateSchema)
    async update(req, res, next) {
        const { id } = req.params
        const { name } = req.body
        const output = await this.factory.permissionService.update({
            id,
            name,
        })
        res.status(200).send({
            message: 'Sucesso',
            data: output,
        })
    }
    @Middlware.validateRequest(['delete_permission'])
    async delete(req, res, next) {
        const { id } = req.params
        const output = await this.factory.permissionService.delete(id)
        console.log(output)
        res.status(200).send({
            message: 'Sucesso',
            data: output,
        })
    }
}
