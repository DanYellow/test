import * as core from '@actions/core';

core.info('\u001b[43mThis background will be yellow');

core.summary.addRaw('Some content here :speech_balloon:', true)
core.summary.addLink('click here', 'https://github.com')
