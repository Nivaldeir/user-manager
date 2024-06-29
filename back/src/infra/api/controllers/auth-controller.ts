import HttpController from './http-controller'
import * as geoip from 'geoip-lite'
import {
    recoveryNewPasswordSchema,
    recoverySchema,
    signInSchema,
} from './schema/AuthSchema'
import Middlware from './middleware'
import { NextFunction, Request, Response } from 'express'
export default class AuthController extends HttpController {
    handle() {
        this.httpServer.on({
            method: 'post',
            url: '/auth/sign-in',
            callback: this.signIn.bind(this),
        })
    }
    private getLocationFromIP(ip: string) {
        const geoData = geoip.lookup(ip)
        if (geoData) {
            return geoData.region
        }
        return null
    }
    @Middlware.validateSchema(signInSchema)
    async signIn(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body
        const ipAddress =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress
        const { token, userDto} = await this.factory.authUser.execute({
            password,
            email,
            device: req.headers['user-agent'] ?? "",
            ip: ipAddress?.toString() ?? "",	
            location:  this.getLocationFromIP(ipAddress as string) ?? "",	
        })
        res.json({
            message: 'Sucesso',
            data: { token, user:userDto },
        }).status(200)
        return
    }
}
