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

const renderMd = async (api: any): Promise<string> => {
    let request = JSON.parse(api.request)
    let response = JSON.parse(api.response)

    let md = `# ${api.label}\n\n`

    let describe = request.describe || ''
    md += `> ${describe}`

    // Detail
    md += `\n\n## Detail\n\n`
    let search = ''
    if (request.params.length > 0) {
        search += '?'
        request.params.forEach((param: any) => {
            search += `${param.field}=${param.value}&`
        })
        search = search.slice(0, -1)
    }
    md += `\`${request.method} ${request.path}${search}\`\n\n`

    // Headers
    md += `#### Headers\n\n`
    if (request.headers.length > 0) {
        md += `| Key | Value | Must | Default | Describe |\n`
        md += `| --- | --- | --- | --- | --- |\n`
        request.headers.forEach((header: any) => {
            md += `| ${header.field} | ${header.value} | ${header.must ? 'Yes' : 'No'} | ${header.default} | ${header.describe} |\n`
        })
    } else {
        md += `None\n\n`
    }

    // Params
    md += `#### Params\n\n`
    if (request.params.length > 0) {
        md += `| Key | Value | Must | Default | Describe |\n`
        md += `| --- | --- | --- | --- | --- |\n`
        request.params.forEach((param: any) => {
            md += `| ${param.field} | ${param.value} | ${param.must ? 'Yes' : 'No'} | ${param.default} | ${param.describe} |\n`
        })
    } else {
        md += `None\n\n`
    }

    // Body
    if (request.body.type == "form") {
        md += `#### Body\n\n`
        if (request.body.form.length > 0) {
            md += `| Key | Value | Must | Default | Describe |\n`
            md += `| --- | --- | --- | --- | --- |\n`
            request.body.form.forEach((form: any) => {
                md += `| ${form.field} | ${form.value} | ${form.must ? 'Yes' : 'No'} | ${form.default} | ${form.describe} |\n`
            })
        } else {
            md += `None\n\n`
        }
    } else if (request.body.type == "json") {
        md += `#### Body\n\n`
        // md += `\`\`\`json\n${request.body.json}\n\`\`\`\n\n`
        md += json2tree(JSON.parse(request.body.json))
        md += `\n\n`
    }

    // Example
    md += `## Example\n\n`
    // Request
    md += `#### Request\n\n`
    md += `\`\`\`json\n`
    md += `// ${request.method} ${request.path}${search}\n\n`
    if (request.headers.length > 0) {
        md += `// Headers\n`
        let hs: { [x: string]: string } = {}
        request.headers.forEach((header: any) => {
            hs[header.field] = header.value
        })
        md += JSON.stringify(hs, null, 4)
        md += `\n\n`
    }
    if (request.body.type == "form") {
        md += `// Body\n`
        let bs: { [x: string]: string } = {}
        request.body.form.forEach((form: any) => {
            bs[form.field] = form.value
        })
        md += JSON.stringify(bs, null, 4)
    } else if (request.body.type == "json") {
        md += `// Body\n`
        md += request.body.json
    }
    md += `\n\`\`\`\n\n`
    // Response
    md += `#### Response\n\n`
    md += `\`\`\`json\n`
    md += `// ${response.status} ${response.statusText}\n\n`
    if (response.headers) {
        md += `// Headers\n`
        md += JSON.stringify(response.headers, null, 4)
        md += `\n\n`
    }
    if (response.body.type == "form") {
        md += `// Body\n`
        let bs: { [x: string]: string } = {}
        response.body.form.forEach((form: any) => {
            bs[form.field] = form.value
        })
        md += JSON.stringify(bs, null, 4)
    } else if (response.body.type == "json") {
        md += `// Body\n`
        md += response.body.json
    }
    md += `\n\`\`\`\n\n`



    return md
}

export default renderMd
