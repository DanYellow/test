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

    onEnd(result) {
        (async () => {
            this.suite?.suites.forEach((suite) => {
                // console.log(suite.project())
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

                for (const filePath of Object.keys(testsDict)) {
                    // console.log(testsDict[filePath]);


                        // core.summary.addHeading(
                        //     path.basename(filePath),
                        //     "2"
                        // );
                        // let tableRes = "";
                        // const tableHeader = `
                        //     <table>
                        //     <thead>
                        //         <tr>
                        //             <th scope="col">Test</th>
                        //             <th scope="col">Status</th>
                        //             <th scope="col">Duration</th>
                        //             <th scope="col">Retries</th>
                        //             <th scope="col">Tag(s)</th>
                        //         </tr>
                        //     </thead>
                        //     <tbody>
                        // `
                        // tableRes = tableHeader;

                        // for (const test of testsDict[filePath]) {
                        //     // core.summary.addRaw(test.title, true);

                        //     const tableBody = `
                                // <tr>
                                //     <td>${test.title}</td>
                                //     <td>${test.expectedStatus}</td>
                                //     <td>${test.results[0].duration / 1000}s</td>
                                //     <td>${test.retries}</td>
                                //     <td>${test._tags.join(", ")}</td>
                                // </tr>
                        //     `
                        //     tableRes += tableBody;
                        // }
                        // tableRes += "</tbody></table>";
                        // console.log("tableRes", tableRes)

                        const tableRes = `
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Test</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Duration</th>
                                        <th scope="col">Retries</th>
                                        <th scope="col">Tag(s)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(testsDict[filePath].map((test) => {
                                        return (
                                            `
                                                <tr>
                                                    <td>${test.title}</td>
                                                    <td>${test.expectedStatus}</td>
                                                    <td>${test.results[0].duration / 1000}s</td>
                                                    <td>${test.retries}</td>
                                                    <td>${test._tags.join(", ")}</td>
                                                </tr>
                                            `
                                        )
                                    }))}
                                </tbody>
                            </table>
                        `
// console.log(tableRes.split("\n").join("\n"))
                        if (process.env.CI) {
                            core.summary.addDetails(
                                path.basename(filePath),
                                tableRes.split("\n").join("\n")
                            );
                        }
                }
            });
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
