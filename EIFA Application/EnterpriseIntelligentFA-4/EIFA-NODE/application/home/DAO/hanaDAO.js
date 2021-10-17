var hana = require('@sap/hana-client');
const path = require("path");
const parentDir = path.join(__dirname, '../../')
const dotenv = require("dotenv");
dotenv.config({
	path: `${parentDir}/.env`
});

var conn = hana.createConnection();
const conn_params = {
	serverNode: process.env.HANA_HOSTNAME,
	uid: process.env.HANA_USERID,
	pwd: process.env.HANA_PASSWORD,
	encrypt: process.env.HANA_ENCRYPTION,
	sslValidateCertificate: process.env.HANA_SSL_VALIDATION
}

const executeQuery = async(queries) => {
	return await new Promise((resolve, reject) => {
		//console.log('query=====>', queries)
		conn.connect(conn_params, (err) => {
			//		console.log('err--->', err)
			let responseJson = {};
			if (err) {
				responseJson.status = 'error';
				responseJson.message = err;
				resolve(responseJson);
			} else {
				for (let i = 0; i < queries.length; i++) {
					conn.exec(queries[i], (err, result) => {
						if (err) {
							responseJson.status = 'error';
							responseJson.message = err;
						} else {
							responseJson.status = 'success';
							responseJson.result = result;
						}
						if (i == queries.length - 1) {
							conn.disconnect();
							resolve(responseJson);
						}
					})
				}
			}
		});
	});
}

exports.executeQuery = executeQuery;