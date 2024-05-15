
export default class Observable {
    observers: Array<any> = []
    add(observer) {
        this.observers.push(observer)
        return this
    }
    remove(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notify(event: string, data: any) {
        this.observers.forEach(observer => {
            observer.update(event, data);
        });
    }
}