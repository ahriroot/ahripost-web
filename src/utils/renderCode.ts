const renderCode = async (api: any): Promise<string> => {
    let request = api.request
    if (typeof request === 'string') {
        request = JSON.parse(api.request)
    }

    let method = request.method
    let url = request.path
    let search = ''
    if (request.query.length > 0) {
        search += '?'
        request.query.forEach((q: any) => {
            search += `${q.field}=${q.value}&`
        })
        search = search.slice(0, -1)
    }

    let headers: { [x: string]: string } = {}
    if (request.headers) {
        request.headers.forEach((item: any) => {
            headers[item.field] = item.value
        })
    }


    let md = ''

    // cURL
    md += `## cURL\n\n`
    md += `\`\`\`bash\n`
    md += `curl -X ${method} \\\n`
    md += `  ${url}${search} \\\n`
    md += `  -H 'Content-Type: application/json' \\\n`
    md += `  -H 'cache-control: no-cache' \\\n`
    md += `  -d '${JSON.stringify(JSON.parse(request.body.json))}'\n`
    md += `\`\`\`\n\n`

    // Python
    md += `## Python\n\n`
    md += `\`\`\`python\n`
    md += `import requests\n\n`
    md += `url = "${url}${search}"\n`
    md += `headers = ${JSON.stringify(headers, null, 4)}\n`
    md += `payload = ${request.body.json}\n\n`
    md += `response = requests.request("${method}", url, headers=headers, data=payload)\n\n`
    md += `print(response.text)\n`
    md += `\`\`\`\n\n`

    // Node
    let option = {
        method: method,
        url: url + search,
        headers: headers,
        body: JSON.parse(request.body.json),
        json: true
    }
    md += `## Node\n\n`
    md += `\`\`\`javascript\n`
    md += `let request = require("request");\n\n`
    md += `let options = ${JSON.stringify(option, null, 4)}\n\n`
    md += `request(options, (error, response) => {\n`
    md += `    if (error) throw new Error(error);\n\n`
    md += `    console.log(response.body);\n`
    md += `});\n`
    md += `\`\`\`\n\n`

    // AJAX
    md += `## AJAX\n\n`
    md += `\`\`\`javascript\n`
    md += `let xhr = new XMLHttpRequest();\n`
    md += `xhr.open("${method}", "${url}${search}");\n`
    md += `xhr.setRequestHeader("Content-Type", "application/json");\n`
    md += `xhr.setRequestHeader("Accept", "application/json");\n`
    md += `xhr.send(${request.body.json});\n\n`
    md += `xhr.onload = function () {\n`
    md += `    console.log(this.responseText);\n`
    md += `};\n`
    md += `\`\`\`\n\n`

    // Axios
    md += `## Axios\n\n`
    md += `\`\`\`javascript\n`
    md += `let axios = require('axios');\n`
    md += `let data = ${request.body.json};\n\n`
    md += `let config = {\n`
    md += `  method: '${method}',\n`
    md += `  url: '${url}${search}',\n`
    md += `  headers: ${JSON.stringify(headers, null, 4)},\n`
    md += `  data : data\n`
    md += `};\n\n`
    md += `axios(config)\n`
    md += `  .then(function (response) {\n`
    md += `    console.log(JSON.stringify(response.data));\n`
    md += `  })\n`
    md += `  .catch(function (error) {\n`
    md += `    console.log(error);\n`
    md += `  });\n`
    md += `\`\`\`\n\n`

    return md
}

export default renderCode
