import { NextFunction, Request, Response } from 'express'
import HttpController from './http-controller'
import Middlware from './middleware'

export default class LoginAuditController extends HttpController {
    handle() {
        this.httpServer.on({
            method: 'get',
            url: '/auth/report/:id',
            callback: this.get.bind(this),
        })
    }

    @Middlware.validateRequest(['get_login_audit'])
    async get(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        console.log(id)
        const output = await this.factory.findUserHistoryAuth.execute({userId:id})
        res.send({
            message: 'Sucesso',
            data: output,
        }).status(200)
    }
}
