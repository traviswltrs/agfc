const { getADriver } = require('databaseDrivers');
const driver = getADriver();
const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    try {
		let sql = SQL`SELECT count(*) FROM agfc_cwd.cooperator WHERE id = 1`.text;
		console.log('Just before query invocation');
		const res = await driver.query(sql);
		console.log('Just after query invocation', res);
		console.log(res && res.length > 0 ? res[0] : 'No result came back');
		const count = res[0].count;
		console.log('just after pulling out count');
		if (count > 0) {
			console.log('Returned count was 0');
		} else {
			console.log('Returned count was: ',count);
		}
    } catch (err) {
        console.log('Handler - Error processing records: ', err);
    }

    console.log('Handler - Just before return success');
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message received' }),
    };
}

module.exports = { handler };