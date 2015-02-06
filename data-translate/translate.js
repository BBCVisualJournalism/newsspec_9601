(function () {

	var excelParser = require('excel-parser'), 
		fs = require('fs');

	var parentProjectDirectoryPath = __dirname.split('/');
	parentProjectDirectoryPath.pop();
	parentProjectDirectoryPath = parentProjectDirectoryPath.join('/');

	/**********************
		* Check the excel file path has been passed
	**********************/
	if (process.argv[2]) {
		parseData(process.argv[2]);
	}
	else {
		console.error('Error:\n-----\nTo use this task parse the path to the csv file as an argument.\n\nExample:\n-------\nnode translate.js ~/Desktop/clothes.xlsx');
		return 1;
	}

	function parseData(spreadsheet, doneCallback) {
		excelParser.parse({
			inFile: spreadsheet,
			worksheet: 1,
			skipEmpty: false
		},
		function(err, data){
			if(err) {
				console.error(err);
				return 1;
			}

			var countryData = {};

			for (var i = 1; i < data[0].length; i+=2) {
				/* Extract country name from '1. United Kindom' format */
				var countryName = data[0][i].match(/\d*\. (.*)/)[1];

				countryData[countryName] = {};
				var country = countryData[countryName];

				for (var x = 1; x < data.length; x++)	{
					var exportLabel = data[x][i];
					if (exportLabel.match(/\d{4} total/i)) {
						country.total = data[x][i+1];
					}
					else if (exportLabel.match(/^country_OTHER$/i)) {
						country['country_OTHER'] = data[x][i+1];
					}
					else if (!exportLabel.match(/^Top \d{2} total$/i) && !exportLabel.match(/^Overall total$/i)) {
						country[exportLabel] = data[x][i+1];
					}
				}

			}

			writeToDataFolder('data.js', countryData);
			
		});
	}


	function writeToDataFolder(filename, object) {
		var path = 'source/js/data/' + filename;

		var outputString = 'define(function(){return ';
		outputString = outputString + JSON.stringify(object);
		outputString = outputString + ';});';

		fs.writeFile(parentProjectDirectoryPath + '/'+ path, outputString, {encoding:'utf8'}, function (err) {
			if (err) {
				throw err;
			}
			console.info('saved the ' + filename + ' data file');
		});

	}
		
}());