import * as core from "@actions/core";
import path from "path";
import Convert from "ansi-to-html";

// core.info('\u001b[43mThis background will be yellow');

// core.summary.addRaw('Some content here :speech_balloon:', true)
// core.summary.addLink('click here', 'https://github.com')

// core.summary.write()

const processResults = (results) => {
    const res = [];
    results.forEach((element) => {
        const payload = {};
        payload.file = element.title;

        res.push(payload);
    });
};

const convert = new Convert();
class MyReporter {
    constructor() {
        this.suite = {};
        this.results = {};
    }

    onBegin(config, suite) {
        this.suite = suite;
        // console.log(suite)
        // this.results[suite.title] = suite.title;
        // console.dir(suite._entries[0]._entries)
        if (process.env.CI) {
            core.summary.addRaw(
                `Total tests: ${suite.allTests().length}`,
                true
            );
            core.summary.write();
        }
        // console.log(`Starting the run with ${suite.allTests().length} tests`);
    }

    onTestBegin(test, result) {
        // console.log(test._requireFile)
        // console.log(test)
        // console.log(`Starting test ${test.title}`);
    }

    onTestEnd(test, result) {
        // if(process.env.CI) {
        //     core.summary.addHeading(path.basename(test._requireFile), '2')
        //     core.summary.addRaw(test.title, true)
        //     const tableData = [
        //         {data: 'Header1', header: true},
        //         {data: 'Header2', header: true},
        //         {data: 'Header3', header: true},
        //         {data: 'MyData1'},
        //         {data: 'MyData2'},
        //         {data: 'MyData3'}
        //       ]
        //       // Add an HTML table
        //       core.summary.addTable([tableData])
        //       core.summary.write()
        // }
        // console.dir(result.duration);
        // console.dir(test);
        // console.log(`Finished test ${test.title}: ${result.status} | ${result.duration / 1000}s`);
        // console.dir(test);
    }
    // https://github.com/estruyf/playwright-github-actions-reporter/blob/main/src/index.ts
    onEnd(result) {
        const getStatus = (test) => {
            let value = test.outcome();

            if (value.toLowerCase() === "flaky") {
                value = "⚠️";
            } else if (value.toLowerCase() === "pass") {
                value = "✅";
            } else if (value.toLowerCase() === "skipped") {
                value = "⏭️";
            } else if (value.toLowerCase() === "fail") {
                value = "❌";
            }

            return `${value} ${test.expectedStatus}`;
        };
        (async () => {
            // core.summary.addRaw('<link rel="stylesheet" href="https://danyellow.net/cours-mmi/consignes.css" />', true)
            // core.summary.addRaw('<script src="https://danyellow.net/cours-mmi/consignes.js" defer></script>', true)

            // const tabs = ['<div class="tab-wrapper">']
            // tabs.push('<ul class="list-tabs">')
            // tabs.push('<li>')
            // tabs.push('<button data-tab-name="windows">Windows</button>')
            // tabs.push('</li>')
            // tabs.push('<li>')
            // tabs.push('<button data-tab-name="linux-macos">Linux / macOS</button>')
            // tabs.push('</li>')
            // tabs.push('</ul>')
            // tabs.push('<ul class="list-tab-content">')
            // tabs.push('<li class="tab-content" data-tab-content="windows">eefe</li>')
            // tabs.push('<li class="tab-content" data-tab-content="linux-macos">aafaf</li>')
            // tabs.push('</ul>')
            // tabs.push('</div>')
            // core.summary.addRaw(tabs.join("\n"), true)

            // if (process.env.CI) {
            //     await core.summary.write();
            // }
            let rootTableTemplate = ["<table role='table'>"];
            rootTableTemplate.push("<thead>");
            rootTableTemplate.push("<tr>");

            const listProjects = this.suite?.suites.map((item) => item.title);
            listProjects.forEach((item) => {
                rootTableTemplate.push(`<th scope='col'>${item}</th>`);
            });
            rootTableTemplate.push("</tr>");
            rootTableTemplate.push("</thead>");

            rootTableTemplate.push("<tbody>");
            rootTableTemplate.push("<tr>");
            listProjects.forEach((item) => {
                rootTableTemplate.push(`<td>__placeholder-${item}__</td>`);
            });
            rootTableTemplate.push("</tr>");
            rootTableTemplate.push("</tbody>");
            rootTableTemplate.push("</table>");

            let res = {};

            let detailsTest = {};
            this.suite?.suites.forEach((suite) => {
                const project = suite.project();
                const projectName = project.name;
                // console.log(projectName)

                // parent.title
                const listTestFiles = suite
                    .allTests()
                    .map((test) => test.location.file)
                    .reduce((acc, curr) => {
                        if (!acc.includes(curr)) {
                            acc.push(curr);
                        }

                        return acc;
                    }, []);

                const testsDict = listTestFiles.reduce((acc, curr) => {
                    acc[curr] = suite.allTests().filter((test) => {
                        return test.location.file === curr;
                    });

                    return acc;
                }, {});
                let rootTableRes = [...rootTableTemplate];
                // console.log("Object", Object.keys(testsDict))
                for (const filePath of Object.keys(testsDict)) {
                    if (filePath in res === false) {
                        res[filePath] = rootTableTemplate;
                    }

                    // console.log(testsDict[filePath]);
                    const tableRes = ["<table role='table'>"];
                    tableRes.push("<thead>");
                    tableRes.push("<tr>");
                    tableRes.push("<th scope='col'>Test</th>");
                    tableRes.push("<th scope='col'>Status</th>");
                    tableRes.push("<th scope='col'>Duration</th>");
                    tableRes.push("<th scope='col'>Retries</th>");
                    tableRes.push("<th scope='col'>Tag(s)</th>");
                    tableRes.push("</tr>");
                    tableRes.push("</thead>");
                    tableRes.push("<tbody>");
                    testsDict[filePath].forEach((test) => {
                        // console.log(test.parent.parent.title)
                        tableRes.push("<tr>");
                        tableRes.push(`<td>${test.title}</td>`);
                        tableRes.push(`<td>${getStatus(test)}</td>`);
                        tableRes.push(
                            `<td>${test.results[0].duration / 1000}s</td>`
                        );
                        tableRes.push(`<td>${test.retries}</td>`);
                        tableRes.push(`<td>${test._tags.join(", ")}</td>`);
                        tableRes.push("</tr>");
                    });
                    tableRes.push("</tbody>");
                    tableRes.push("</table>");

                    res[filePath] = res[filePath].map((item) => {
                        return item.replace(
                            `__placeholder-${projectName}__`,
                            tableRes.join("\n")
                        );
                    });
                    // detailsTest = { file: path.basename(filePath), content: tableRes, projectName }

                    // if (process.env.CI) {
                    //     core.summary.addDetails(
                    //         path.basename(filePath),
                    //         tableRes.join("\n")
                    //     );
                    // }
                }
            });

            for (const [key, value] of Object.entries(res)) {
                console.log(value.join("\n"))
            }

            if (process.env.CI) {
                for (const [key, value] of Object.entries(res)) {
                    core.summary.addDetails(
                        path.basename(key),
                        value.join("\n")
                    );
                }
            }

            if (process.env.CI) {
                await core.summary.write();
            }
        })();

        // console.dir(this.suite.suites[0]._entries[0]);
        // console.dir(this.suite._entries);
        // console.log(`Finished the run: ${result.status}`);
    }
}

export default MyReporter;
