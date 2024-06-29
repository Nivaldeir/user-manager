import {
    userFindSchema,
    userGetSchema,
    userSaveSchema,
    userUpdateSchema,
} from './schema/UserSchema'
import HttpController from './http-controller'
import { NextFunction, Request, Response } from 'express'
import Middlware from './middleware'

export default class UserController extends HttpController {
    handle() {
        this.httpServer.on({
            method: 'get',
            url: '/user',
            callback: this.findMany.bind(this),
        })
        this.httpServer.on({
            method: 'post',
            url: '/user',
            callback: this.create.bind(this),
        })
        this.httpServer.on({
            method: 'patch',
            url: '/user/:id',
            callback: this.update.bind(this),
        })
        this.httpServer.on({
            method: 'get',
            url: '/user/:id',
            callback: this.get.bind(this),
        })
        this.httpServer.on({
            method: 'delete',
            url: '/user/:id',
            callback: this.delete.bind(this),
        })
    }
    @Middlware.validateSchema(userFindSchema)
    @Middlware.validateRequest(['find_user'])
    async find(req: Request, res: Response, next: NextFunction) {
        const output = await this.factory.findUser.execute({
            id: req.params.id
        })
        res.status(200).send({
            message: 'Sucesso',
            data: output,
        })
    }

    @Middlware.validateSchema(userFindSchema)
    @Middlware.validateRequest(['FIND_MANY_USER'])
    async findMany(req: Request, res: Response, next: NextFunction) {
        const output = await this.factory.findManyUsers.execute()
        res.status(200).send({
            message: 'Sucesso',
            data: output,
        })
    }
    @Middlware.validateSchema(userSaveSchema)
    async create(req: Request, res: Response, next: NextFunction) {
        const { email, password, username } = req.body
        const output = await this.factory.createUser.execute({
            email,
            password,
            username,
        })
        res.status(201).send({
            message: 'Sucesso',
            data: output,
        })
    }

    @Middlware.validateRequest(['UPDATE_USER'])
    @Middlware.validateSchema(userUpdateSchema)
    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { password, username, permissions, active } = req.body
        console.log(permissions)
        const output = await this.factory.updateUser.execute({
            id,
            password,
            username,
            active,
            permissions
        })
        res.send({
            message: 'Sucesso',
            data: output,
        })
    }

    @Middlware.validateRequest(['get_user'])
    @Middlware.validateSchema(userGetSchema)
    async get(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const output = await this.factory.findUser.execute({id})
        res.send({
            message: 'Sucesso',
            data: output,
        })
    }

    @Middlware.validateRequest(['delete_user'])
    @Middlware.validateSchema(userGetSchema)
    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const output = await this.factory.deleteUser.execute({id})
        res.send({
            message: 'Sucesso',
            data: output,
        })
    }
}
