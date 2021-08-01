const puppeteer = require('puppeteer');
const path = require('path');
// '..' since we're in the test/ subdirectory; learner is supposed to have src/index.html
const pagePath = 'file://' + path.resolve(__dirname, '../src/index.html');

const hs = require('hs-test-web');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function stageTest() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args:['--start-maximized', '--disable-infobar'],
        ignoreDefaultArgs: ['--enable-automation']
    });

    const page = await browser.newPage();
    await page.goto(pagePath);

    page.on('console', msg => console.log(msg.text()));

    await sleep(1000);

    let result = await hs.testPage(page,
        // Test #1
        () => {
            const nodes = document.getElementsByClassName("title");

            if (nodes.length !== 1) {
                return hs.wrong("There is should be one element with class 'title', found " + nodes.length + "!")
            }

            const titleDiv = nodes[0];

            if (titleDiv.textContent !== 'Case Converter') {
                return hs.wrong("The title name should be 'Case Converter', but found " + titleDiv.textContent)
            }

            return hs.correct()
        },

        // Test #2
        () => {
            const nodes = document.getElementsByTagName("textarea");

            if (nodes.length !== 1) {
                return hs.wrong("There is should be one element with class 'title', found " + nodes.length + "!")
            }

            const textArea = nodes[0];

            if (textArea.textContent !== '') {
                return hs.wrong("TextArea should be empty by default!")
            }

            return hs.correct()
        },

        // Test #3
        () => {
            const upperCaseButton = document.querySelector("button#upper-case")
            const lowerCaseButton = document.querySelector("button#lower-case")
            const properCaseButton = document.querySelector("button#proper-case")
            const sentenceCaseButton = document.querySelector("button#sentence-case")

            if (upperCaseButton === null) {
                return hs.wrong("Can't find a button with '#upper-case' id!")
            }

            if (lowerCaseButton === null) {
                return hs.wrong("Can't find a button with '#lower-case' id!")
            }

            if (properCaseButton === null) {
                return hs.wrong("Can't find a button with '#proper-case' id!")
            }

            if (sentenceCaseButton === null) {
                return hs.wrong("Can't find a button with '#sentence-case' id!")
            }

            return hs.correct()
        },
    );

    await browser.close();
    return result;
}


jest.setTimeout(30000);
test("Test stage", async () => {
        let result = await stageTest();
        if (result['type'] === 'wrong') {
            fail(result['message']);
        }
    }
);
