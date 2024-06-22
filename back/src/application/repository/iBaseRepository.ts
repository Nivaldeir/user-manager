export default interface IBaseRepository<T> {
    save(input: Omit<T, 'id'>): Promise<any>
    update(input: InputUpdate<T>): Promise<any>
    findByUnique(where: any): Promise<T>
    find(input?: any): Promise<T[]>
    delete(id: string): Promise<boolean>
}

type InputUpdate<T> = Partial<Omit<T, 'id'>> & { id: string }
