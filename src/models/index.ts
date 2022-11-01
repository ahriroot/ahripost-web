import { init } from 'iorm'
import Item from '@/models/Item'
import Project from '@/models/Project'

const create = async (): Promise<number> => {
    let count = await init({
        models: [Item, Project],
    })
    return count
}

export default create
export { Item, Project }
