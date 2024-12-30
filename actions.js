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

    // https://github.com/estruyf/playwright-github-actions-reporter/blob/main/src/index.ts
    onEnd(result) {
        const getStatusIcon = (testStatus) => {
            switch (testStatus.toLowerCase()) {
                case "flaky":
                    return "⚠️";
                case "skipped":
                    return "⏭️";
                case "passed":
                case "expected":
                    return "✅";
                default:
                    return "❌";
            }
        };

        const getTestOutcome = (outcome) => {
            switch (outcome.toLowerCase()) {
                case "expected":
                    return "passed";
                case "flaky":
                case "unexpected":
                    return "failed";
                default:
                    return outcome.toLowerCase();
            }
        };

        const getTestTitle = (test) => {
            if (!test) {
                return "";
            }

            const parent = test.parent;

            if (!parent || !parent.title) {
                return test.title;
            }

            if (path.basename(test._requireFile) === parent.title) {
                return test.title;
            }
            return `${parent.title} > ${test.title}`;
        };

        (async () => {
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

            this.suite?.suites.forEach((suite) => {
                const project = suite.project();
                // console.log(result);
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
                // console.log(suite.allTests())
                const testsDict = listTestFiles.reduce((acc, curr) => {
                    acc[curr] = suite.allTests().filter((test) => {
                        return test.location.file === curr;
                    });

                    return acc;
                }, {});

                for (const filePath of Object.keys(testsDict)) {
                    if (filePath in res === false) {
                        res[filePath] = rootTableTemplate;
                    }

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
                        tableRes.push("<tr>");
                        tableRes.push(`<td>${getTestTitle(test)}</td>`);
                        tableRes.push(
                            `<td>${getStatusIcon(
                                test.outcome()
                            )} ${getTestOutcome(test.outcome())}</td>`
                        );
                        tableRes.push(
                            `<td>${(test.results[0].duration / 1000).toFixed(
                                2
                            )}s</td>`
                        );
                        tableRes.push(`<td>${test.results.at(-1).retry}</td>`);
                        tableRes.push(
                            `<td>${(test._tags || [])
                                .map((t) =>
                                    t.startsWith(`@`) ? t.substring(1) : t
                                )
                                .join(", ")}</td>`
                        );
                        tableRes.push("</tr>");
                        // for (const annotation of test.annotations) {
                        //     console.log( annotation)

                        // }
                    });
                    tableRes.push("</tbody>");
                    tableRes.push("</table>");

                    res[filePath] = res[filePath].map((item) => {
                        return item.replace(
                            `__placeholder-${projectName}__`,
                            tableRes.join("\n")
                        );
                    });
                    // if (process.env.CI) {
                    //     core.summary.addDetails(
                    //         path.basename(filePath),
                    //         tableRes.join("\n")
                    //     );
                    // }
                }
            });

            // for (const [key, value] of Object.entries(res)) {
            //     console.log(value.join("\n"))
            // }

            if (process.env.CI) {
                core.summary.addHeading("Summary", "3");
                for (const [key, value] of Object.entries(res)) {
                    core.summary.addDetails(
                        path.basename(key),
                        value.join("\n")
                    );
                }
            }

            if (result.status.toLowerCase() === "failed") {
                if (process.env.CI) {
                    core.error("e2e went wrong");
                }
            }

            if (process.env.CI) {
                const summary = [];
                for (const [key, value] of Object.entries(result)) {
                    let res = value;
                    if (key === "duration") {
                        res = `${(value / 1000).toFixed(2)}s`;
                    } else if (key === "status") {
                        res = `${getStatusIcon(value)} ${value}`;
                    } else if (key === "startTime") {
                    }
                    summary.push(`${key}: ${res}`);
                }
                core.summary.addList(summary, false);
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
