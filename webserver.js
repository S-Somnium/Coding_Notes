const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises

const PORT = process.env.PORT || 3000

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath, 
            !contentType.includes('image')?'utf8':'')
        const data = contentType === "application/json"
                     ? JSON.parse(rawData):rawData

        response.writeHead(
            filePath.includes('404.html')?404:200, // check if we are sending the 404 html
            {'Content-type': contentType})
        response.end(contentType==="application/json"?JSON.stringify(data):data)
    } catch (err) {
        console.log(err)
        response.statusCode = 500
        response.end()
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)

    const extension = path.extname(req.url)

    let contentType

    switch (extension) {
        case '.css':
            contentType = 'text/css'
            break;
        case '.js':
            contentType = 'text/javascript'
            break;
        case '.json':
            contentType = 'application/json'
            break;
        case '.jpg':
            contentType = 'image/jpeg'
            break;
        case '.png':
            contentType = 'image/png'
            break;
        case '.txt':
            contentType = 'text/plain'
            break;
        default:
            contentType = 'text/html'
            break;
    }

    const htmlFolder = "start" // the folder where html its.

    let filePath =
          contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, htmlFolder, req.url, 'index.html')  //default page
            : contentType === 'text/html' 
                ? path.join(__dirname, htmlFolder, req.url) 
                : path.join(__dirname, req.url) // -> anything that isnt html comes here.

    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html'

    const fileExists = fs.existsSync(filePath)

    if (fileExists) serveFile(filePath, contentType, res) // serve file
    else
        switch (path.parse(filePath).base) {
            case 'old': // old.html doesnt exist anymore, that is why we redirect to not.html
                res.writeHead(301, {    // 301 -> redirect
                    'Location': '/not'
                });
                res.end()
                break
            default: // here we send our not found
                serveFile(path.join(__dirname, htmlFolder, '404.html'), 'text/html', res)    // 404 -> not found

        }

})

server.listen(PORT, () => console.log(`server running on ${PORT}`))
