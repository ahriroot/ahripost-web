const json2tree = (json: any, deep: number = 0) => {
    let md = ''
    for (let key in json) {
        if (typeof json[key] == 'object') {
            md += `${'  '.repeat(deep)}- ${key}\n`
            md += json2tree(json[key], deep + 1)
        } else {
            md += `${'  '.repeat(deep)}- ${key}: ${json[key]}\n`
        }
    }
    return md
}

class Analyze {
    api: any
    request: any
    response: any
    part: { [x: string]: string | null } = {}
    constructor(api: any) {
        this.api = api
        let request = api.request
        if (typeof request === 'string') {
            request = JSON.parse(api.request)
        }
        let response = api.response
        if (typeof response === 'string') {
            response = JSON.parse(api.response)
        }
        this.request = request
        this.response = response
        this.part = {
            title: this._title(),
            describe: this._describe(),
            path: this._path(),
            header: this._header(),
            query: this._query(),
            body: this._body(),
            datetime: this._datetime(),
        }
    }

    private _title() {
        return `# ${this.api.label}`
    }

    private _describe() {
        return `> ${this.request.describe}`
    }

    private _path() {
        let search = ''
        if (this.request.query.length > 0) {
            search += '?'
            this.request.query.forEach((q: any) => {
                search += `${q.field}=${q.value}&`
            })
            search = search.slice(0, -1)
        }
        return `\`${this.request.method} ${this.request.path}${search}\``
    }

    private _header() {
        let md = `#### Headers\n\n`
        if (this.request.headers.length > 0) {
            md += `| Key | Value | Must | Default | Describe |\n`
            md += `| --- | --- | --- | --- | --- |\n`
            this.request.headers.forEach((header: any) => {
                md += `| ${header.field} | ${header.value} | ${header.must ? 'Yes' : 'No'} | ${header.default} | ${header.describe} |\n`
            })
            md = md.slice(0, -1)
        } else {
            md += `None`
        }
        return md
    }

    private _query() {
        let md = `#### Query\n\n`
        if (this.request.query.length > 0) {
            md += `| Key | Value | Must | Default | Describe |\n`
            md += `| --- | --- | --- | --- | --- |\n`
            this.request.query.forEach((q: any) => {
                md += `| ${q.field} | ${q.value} | ${q.must ? 'Yes' : 'No'} | ${q.default} | ${q.describe} |\n`
            })
            md = md.slice(0, -1)
        } else {
            md += `None`
        }
        return md
    }

    private _body() {
        let md = '#### Body\n\n'
        if (this.request.body.type == "form") {
            if (this.request.body.form.length > 0) {
                md += `| Key | Value | Must | Default | Describe |\n`
                md += `| --- | --- | --- | --- | --- |\n`
                this.request.body.form.forEach((form: any) => {
                    md += `| ${form.field} | ${form.value} | ${form.must ? 'Yes' : 'No'} | ${form.default} | ${form.describe} |\n`
                })
            } else {
                md += `None`
            }
        } else if (this.request.body.type == "json") {
            md += `\`\`\`json\n`
            md += JSON.stringify(JSON.parse(this.request.body.json), null, 4)
            md += `\n\`\`\``
        }
        return md
    }

    private _datetime() {
        return `> @ ${new Date(this.response.datetime).toLocaleString()}`
    }

    public getRequest() {
        let search = ''
        if (this.request.query.length > 0) {
            search += '?'
            this.request.query.forEach((q: any) => {
                search += `${q.field}=${q.value}&`
            })
            search = search.slice(0, -1)
        }
        let md = `#### Request\n\n`
        md += `\`\`\`json\n`
        md += `// ${this.request.method} ${this.request.path}${search}\n\n`
        if (this.request.headers.length > 0) {
            md += `// Headers\n`
            let hs: { [x: string]: string } = {}
            this.request.headers.forEach((header: any) => {
                hs[header.field] = header.value
            })
            md += JSON.stringify(hs, null, 4)
            md += `\n\n`
        }
        if (this.request.body.type == "form") {
            md += `// Body\n`
            let bs: { [x: string]: string } = {}
            this.request.body.form.forEach((form: any) => {
                bs[form.field] = form.value
            })
            md += JSON.stringify(bs, null, 4)
        } else if (this.request.body.type == "json") {
            md += `// Body\n`
            md += this.request.body.json
        }
        md += `\n\`\`\``
        return md
    }

    public getResponse() {
        let md = `#### Response\n\n`
        md += `\`\`\`json\n`
        md += `// ${this.response.status} ${this.response.statusText}`
        if (this.response.headers.length > 0) {
            md += `\n\n// Headers\n`
            let hs: { [x: string]: string } = {}
            this.response.headers.forEach((header: any) => {
                hs[header.field] = header.value
            })
            md += JSON.stringify(hs, null, 4)
        }
        if (this.response.body.type == "pretty") {
            md += `\n\n// Body\n`
            md += this.response.body.json
        }
        md += `\n\`\`\`\n\n`
        if (this.response.body.type == "preview") {
            md += `\`\`\`html\n`
            md += this.response.body.html
            md += `\n\`\`\`\n\n`
        } else if (this.response.body.type == "raw") {
            md += `\`\`\`text\n`
            md += this.response.body.text
            md += `\n\`\`\``
        }
        return md
    }

    public getDetail() {
        let md = `## Detail

${this.part.path}

${this.part.header}

${this.part.query}

${this.part.body}
`
        return md
    }

    public getExample() {
        let md = `## Example

${this.part.datetime}

${this.getRequest()}

${this.getResponse()}
`
        return md
    }

    public getPart(name: string): string {
        if (name == 'detail') {
            return this.getDetail()
        }
        switch (name) {
            case 'detail':
                return this.getDetail()
            case 'example':
                return this.getExample()
            case 'request':
                return this.getRequest()
            case 'response':
                return this.getResponse()
            default:
                return this.part[name] || ''
        }
    }
}

const renderMd = async (api: any): Promise<string> => {
    let analyze = new Analyze(api)
    let content = api.template.replace(/\{\{(.+?)\}\}/g, (...args: any) => {
        let name: string = args[1]
        if (name) {
            return analyze.getPart(name.trim())
        }
        return ''
    })
    return content
}

export default renderMd
