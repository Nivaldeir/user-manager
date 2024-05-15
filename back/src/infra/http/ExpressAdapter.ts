import express, { NextFunction, Request, Response } from "express";
import IHttpServer, { InputHttp } from "./iHttpServer";
import swaggerUi from "swagger-ui-express"
import Logger from "../logger";
import swaggerDoc from "../../../swagger.json"
import cors from "cors"
import redoc from "redoc-express"
import { HttpError } from "../errors/HttpError";
import https from "https"
import session from 'express-session'
import cookieSession from "cookie-session";
import fs from "fs"
function logRequest(req, res, next) {
  Logger.instance.debug(`${req.method} ${req.url}`);
  next();
}

export default class ExpressAdapter implements IHttpServer {
  app: express.Express;
  constructor() {
    this.app = express();
    this.app.set('trust proxy', 1);
    this.app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }));
    this.app.use(express.json());
    this.app.use(logRequest)
    this.app.use(cookieSession({
      secret: 'your-secret-key',

      keys: ['key']
    }));
    this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc))
    this.app.use("/swagger", (_: Request, res: Response) => {
      return res.sendFile(process.cwd() + "/swagger.json")
    })
    this.app.get('/docs/swagger.json', (req, res) => {
      res.sendFile('swagger.json', { root: '.' });
    });

    this.app.get(
      '/docs',
      redoc({
        title: 'API Docs',
        specUrl: '/docs/swagger.json',
        nonce: '',
        redocOptions: {
          theme: {
            colors: {
              primary: {
                main: '#6EC5AB'
              }
            },
            typography: {
              fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
              fontSize: '15px',
              lineHeight: '1.5',
              code: {
                code: '#87E8C7',
                backgroundColor: '#4D4D4E'
              }
            },
            menu: {
              backgroundColor: '#ffffff'
            }
          }
        }
      })
    );
    this.app.use("/doc", (req: Request, res: Response) => {
      return res.sendFile(process.cwd() + "/redoc-static.html")
    })
  }
  on(params: InputHttp) {
    const { callback, method, url, } = params;
    this.app[method](
      url,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          await callback(req, res, next);
        } catch (err: any) {
          if (err instanceof HttpError) {
            res.status(err.status).send({
              error: true,
              message: err.message
            })
          } else {
            res.status(404).send({
              error: true,
              message: err.message
            })
          }
        }
      }
    );
  }

  listen(port: number): void {
    this.app.listen(port)
    https.createServer({
      cert: fs.readFileSync("src/SSL/code.crt"),
      key: fs.readFileSync("src/SSL/code.key")
    }, this.app).listen((port + 1), () => Logger.instance.success("HTTPS : listen " + (port + 1)));
    Logger.instance.success("EXPRESS : listen " + port);
  }
}