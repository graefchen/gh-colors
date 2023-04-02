const fs = require('fs');
const https = require('https');
const yaml = require('js-yaml');
const inputFile = 'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml';
const outputFile = 'src/json/languages.json';


console.log("Trying to make the " + outputFile + " file... ");
// fs.writeFileSync(outputFile, "const languageArray = ");
// Get document, or throw exception on error
try {
	https.get(inputFile, (res) => {
		var { statusCode } = res;
		let error;

		if (statusCode !== 200) {
			error = new Error('Request Failed.\n' +
				`Status Code: ${statusCode}`);
		}

		if (error) {
			console.error(error.message);
			// consume response data to free up memory
			res.resume();
		}

		res.setEncoding('utf8');
		let rawData = '';

		res.on('data', (chunk) => {
			rawData += chunk;
		});

		res.on('end', () => {
			try {
				console.log("Request ended... now parsing...");
				const doc = yaml.load(rawData);
				console.log("Generating to file...");
				let languageArray = Object.entries(doc).map(([name, obj]) => ({ name, ...obj}));
				let json = JSON.stringify(languageArray, null, 5);
				fs.writeFileSync(outputFile, json);
				console.log("Finished to make the " + outputFile + " file!");
			} catch (e) {
				console.error(e.message);
			}
		});
	}).on('error', (e) => {
		console.error(`Got error: ${e.message}`);
	});

} catch (e) {
	console.error(e);
}