import { IEmailRepository } from "../../application/repository/iEmailRepository";
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";
import fs from "fs"
import Logger from "../logger";

export class NodemailerAdapter implements IEmailRepository {
    mailer: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
    constructor() {
        this.mailer = nodemailer.createTransport({
            host: process.env.NODEMAILER_HOST!,
            port: parseInt(process.env.NODEMAILER_PORT!),
            auth: {
                user: process.env.NODEMAILER_USER!,
                pass: process.env.NODEMAILER_PASS!
            }
        });
    }
    async send(input: { email: string; object: object; layout: string; subject: string; }): Promise<void> {
        let htmlContent = await this.readHtml(input.layout, input.object)
        this.mailer.sendMail({
            to: input.email,
            from: "nivaldeir-silva@hotmail.com",
            subject: input.subject,
            html: htmlContent,
        }, function (err, data) {
            if (err) {
                Logger.instance.error("Error " + err);
            } else {
                Logger.instance.success("Email sent successfully");
            }
        });
        return
    }
    private async readHtml(template: string, obj: object) {
        let templateHtml = fs.readFileSync(`src/infra/email/templates/${template}.html`, 'utf8');
        Object.keys(obj).forEach((e) => {
            templateHtml = templateHtml.replace(`{{${e}}}`, obj[e])
        })
        return templateHtml
    }
}