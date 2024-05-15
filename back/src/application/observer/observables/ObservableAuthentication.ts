import { ICache } from "../../../infra/cache/ICache";
import Injectable from "../../../infra/di/Injectable";
import { IEmailRepository } from "../../repository/iEmailRepository";
import { ILoginAuditRepository } from "../../repository/iLoginAudit";
import UserService from "../../services/User.service";
import Observer from "../Observer";
type EventObservableAuthentication = "first-machine" | "send-email" | "update-permission"

export default class ObservableAuthentication extends Observer {
    @Injectable("cache")
    cache: ICache
    constructor(private readonly loginRepository: ILoginAuditRepository, private readonly emailRepository: IEmailRepository, private readonly userService: UserService) {
        super();
    }
    async update(event: EventObservableAuthentication, data: any) {
        switch (event) {
            case "first-machine":
                const loginAudit = await this.loginRepository.findByUnique({
                    ip: data.details.ip,
                    userAuthenticationId: data.id,
                    success: true
                })
                await this.loginRepository.save({
                    device: data.details.device,
                    ip: data.details.ip,
                    location: data.details.location,
                    success: true,
                    userAuthenticationId: data.user.id,
                    createdAt: new Date().toISOString()
                });
                if (!loginAudit) {
                    this.update("send-email", {
                        email: data.email,
                        details: data.details,

                    })
                }
                return;
            case "send-email":
                await this.emailRepository.send({
                    email: data.email,
                    layout: "new-login",
                    object: {
                        email: data.email,
                        date: new Date().toLocaleString(),
                        ip: data.details.ip,
                        location: `${data.details.location}`,
                        device: data.details.device
                    },
                    subject: "Login registrado em um dispositivo novo"
                })
                return;
            case "update-permission":
                const { permissions } = await this.userService.gettingPermissions(data.userId)
                console.log("update-permission", permissions)
                await this.cache.Set(`${data.userId}_permission`, permissions.toString())
                
                const a = await this.cache.Get(`${data.userId}_permission`)
                console.log("CACHED", a.split(","))
        }
    }
}