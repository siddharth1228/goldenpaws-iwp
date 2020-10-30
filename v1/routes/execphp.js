/**
*
*/
class ExecPHP {
	/**
	*
	*/
	constructor() {
		this.phpPath = '‪C:\\xampp\\php\\php.exe';
		this.phpFolder = '';

		this.email='';
	
		this.length1='';
	}	
	/**
	*
	*/
	
	parseFile(fileName,length1,email,callback) {
		var realFileName = this.phpFolder + fileName;
		var argsString = length1+','+email;
		console.log('parsing file: ' + realFileName);

		var exec = require('child_process').exec;
		var cmd = 'php'+ ' ' + realFileName+' '+argsString;
		
		exec(cmd, function(error, stdout, stderr) {
			callback(stdout);
			
		});
		
	}
}
module.exports = function() {
	return new ExecPHP();
};