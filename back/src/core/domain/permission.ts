import { randomUUID } from 'crypto'

type IPermission = {
  id: string
  name: string
}

export class Permission {
  id: string
  name: string

  constructor(props: IPermission) {
    this.id = props.id
    this.name = props.name
  }

  static create(name: string): Permission {
    const id = randomUUID()
    return new Permission({
      id,
      name,
    })
  }
}
