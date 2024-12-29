import * as core from "@actions/core";


// core.info('\u001b[43mThis background will be yellow');

// core.summary.addRaw('Some content here :speech_balloon:', true)
// core.summary.addLink('click here', 'https://github.com')

// core.summary.write()

class MyReporter {
    onBegin(config, suite) {
        core.summary.addRaw(`Total tests: ${suite.allTests().length}`, true)
        core.summary.write()
        // console.log(`Starting the run with ${suite.allTests().length} tests`);
    }

    onTestBegin(test, result) {
        // console.log(`Starting test ${test.title}`);
    }

    onTestEnd(test, result) {
        core.summary.addHeading(test.title, '2')
        // core.summary.addRaw(test.title, true)
        // console.dir(result.duration);
        // console.dir(test);
        core.summary.write()
        console.log(`Finished test ${test.title}: ${result.status} | ${result.duration / 1000}s`);
    }

    onEnd(result) {
        // console.log(`Finished the run: ${result.status}`);
    }
}

export default MyReporter;
