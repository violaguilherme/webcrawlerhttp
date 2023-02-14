const { JSDOM } = require("jsdom")

async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObject = new URL(baseURL)
    const currentURLObject = new URL(currentURL)

    if (baseURLObject.hostname !== currentURLObject.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)

    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL] ++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`Actively crawling: ${currentURL}`)

    try {
        const response = await fetch(currentURL)

        if (response.status > 399) {
            console.log(`Error with status ${response.status} on page ${currentURL}`)
            return pages
        }

        const contentType = response.headers.get("content-type")

        if (!contentType.includes("text/html")) {
            console.log(`Non HTML response, content type ${contentType} don't exist on page ${currentURL}`)
            return pages
        }

        const htmlBody = await response.text()
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages)
        }

    } catch(err) {
        console.log(`Error: ${err.message} on page ${currentURL}`)
    }

    return pages
}

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
    getURLsFromHTML,
    crawlPage
}