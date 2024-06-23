import pgPromise, { ITask } from "pg-promise"

export default interface DatabaseConnection<T = unknown> {
  query(state: string, params: T): Promise<T | T[]>
  rollback(callback: (tx: ITask<{}>) => any ): Promise<any>
  close(): Promise<void>
}