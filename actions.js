import * as core from "@actions/core";
import path from "path";


// core.info('\u001b[43mThis background will be yellow');

// core.summary.addRaw('Some content here :speech_balloon:', true)
// core.summary.addLink('click here', 'https://github.com')

// core.summary.write()

class MyReporter {
    onBegin(config, suite) {
        console.dir(suite._entries[0]._entries)
        if(process.env.CI) {
            core.summary.addRaw(`Total tests: ${suite.allTests().length}`, true)
            core.summary.write()
        }
            // console.log(`Starting the run with ${suite.allTests().length} tests`);
    }

    onTestBegin(test, result) {
        // console.log(test._requireFile)
        // console.log(result)
        // console.log(`Starting test ${test.title}`);
    }

    onTestEnd(test, result) {
        if(process.env.CI) {
            core.summary.addHeading(path.basename(test._requireFile), '2')
            core.summary.addRaw(test.title, true)


            const tableData = [
                {data: 'Header1', header: true},
                {data: 'Header2', header: true},
                {data: 'Header3', header: true},
                {data: 'MyData1'},
                {data: 'MyData2'},
                {data: 'MyData3'}
              ]

              // Add an HTML table
              core.summary.addTable([tableData])

              core.summary.write()
        }
        // console.dir(result.duration);
        // console.dir(test);
        // console.log(`Finished test ${test.title}: ${result.status} | ${result.duration / 1000}s`);
    }

    onEnd(result) {
        // console.dir(result);
        // console.dir(tes);
        // console.log(`Finished the run: ${result.status}`);
    }
}

export default MyReporter;
