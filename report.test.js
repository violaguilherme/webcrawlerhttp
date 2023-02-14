const { test, expect } = require("@jest/globals")

const { sortPages } = require("./report.js") 

test("sortPages two pages", () => {
    const input = {
        "https://wagslane.dev/path": 1,
        "https://wagslane.dev": 3
    }
    const actual = sortPages(input)
    const expected = [
        ["https://wagslane.dev", 3],
        ["https://wagslane.dev/path", 1],
    ]
    expect(actual).toEqual(expected)
})

test("sortPages", () => {
    const input = {
        "https://wagslane.dev/path1": 5,
        "https://wagslane.dev/path4": 2,
        "https://wagslane.dev/path3": 1,
        "https://wagslane.dev/path2": 7,
        "https://wagslane.dev": 3
    }
    const actual = sortPages(input)
    const expected = [
        ["https://wagslane.dev/path2", 7],
        ["https://wagslane.dev/path1", 5],
        ["https://wagslane.dev", 3],
        ["https://wagslane.dev/path4", 2],
        ["https://wagslane.dev/path3", 1],
    ]
    expect(actual).toEqual(expected)
})