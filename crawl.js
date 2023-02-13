const { JSDOM } = require("jsdom")

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll("a")

    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0, 1) === "/") {
            try {
                const urlObject = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObject.href)
            } catch(err) {
                console.log(`Error with relative url ${err.message}`)
            }
        } else {
            try {
                const urlObject = new URL(linkElement.href)
                urls.push(urlObject.href)
            } catch(err) {
                console.log(`Error with absolute url ${err.message}`)
            }
        }
    }
    return urls
}

function normalizeURL(urlString) {
    const urlObject = new URL(urlString)
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`

    return hostPath.length > 0 && hostPath.slice(-1) === "/" ? hostPath.slice(0, -1) : hostPath 
}

module.exports = {
    normalizeURL,
    getURLsFromHTML
}