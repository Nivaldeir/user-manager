import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Errors } from "./Errors";
import { HttpError } from "./HttpError";

export class ErrorHandler extends Errors<ErrorHandler> {
  setNext(handler: ErrorHandler): ErrorHandler {
    return handler;
  }
  async handle(error: Error): Promise<any> {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new HttpError(
          `Já existe informação com esse ${error.meta.target[0]}`,
          409
        );
      }
      if (error.code === "P2025") {
        throw new HttpError(`Já existe informação com esse`, 409);
      }
    }
    if (this.nextHandler) {
      return this.nextHandler.handle(error);
    }
    throw error;
  }
}
