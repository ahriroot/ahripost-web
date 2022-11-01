import { DB } from "iorm"

let db = new DB({
    name: 'dbname',
    version: 1,
})
// let db = null

export default db