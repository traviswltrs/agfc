const PG = require('pg');
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm"); // CommonJS import

const pid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
console.log("DBDriver", "PID", pid);


class DatabaseDriver {
  async query(sql, parameters) {
    throw new Error("Not implemented");
  }

  async close() {
    throw new Error("Not implemented");
  }
}

const getConObj = async () => {
  //Build the SSM Path 
  console.log('XXXXXXXXXXXXXXXXXXXXX  Fetching a new connection object XXXXXXXXXXXXXXXXXXXXXXXX')
  let ssmTemplate = process.env.SSMPath;
  let path = ssmTemplate + "connectionString"
  const client = new SSMClient({ region: process.env.AWS_REGION });
  const command = new GetParameterCommand({ Name: path, WithDecryption: true });
  let response = null;
  try {
    console.log('Just before sending command')
    response = await client.send(command);
    console.log('Response from SSM: ', response);
  } catch (err) {
    console.log('Error getting connection string from SSM: ', err);
  }

  let conString = response.Parameter.Value;

  //Npgsql is a collection of keys and values in a string delimited by ; and linked by =
  //ex Server=blah;username=blah'password=blah
  //First step is to split these into their key=value groups
  let splitConfig = conString.split(";")
  let keyValues = {};
  splitConfig.forEach(x => {
    //Now split the keys from the values
    let kv = x.split("=");
    let key = kv.shift();
    let val = kv.join("=");

    //And remap to an object
    keyValues[key] = val;
  });

  //Connection object format the pg lib is expecting
  let conobj = {
    user: keyValues["Username"],
    host: keyValues["Server"],
    database: keyValues["Database"],
    password: keyValues["Password"],
    port: keyValues["Port"],
    application_name: `agfc-cwd-${pid}-${process.env.AWS_LAMBDA_FUNCTION_NAME}`,
    idle_in_transaction_session_timeout: 1000
  }

  return conobj;
}

let connectionObject = null;

class PGDatabaseDriver extends DatabaseDriver {
  constructor() {
    super();
    this.pgClient = null;
  }

  async setupClient() {
    if (!this.pgClient) {
      if (!connectionObject) {
        console.log('No connection object found, fetching a new one');
        connectionObject = await getConObj();
      }
      // let conobj = await getConObj();
      this.pgClient = new PG.Client(connectionObject);
      await this.pgClient.connect();
    }
  }

  async query(sql, parameters) {
    await this.setupClient();

    // SQL will be formatted in the form that the RDSDataService expects, we need to convert any parameters into the format PG expects
    // That means that letiables labeled with ':' will be replaced with '$1', '$2', etc.
    // We also need to convert the parameters into the format that PG expects

    //NOTE this routine won't work as expected if you have parameters that share the begining part of their name with another parameter.
    //for example, if you pass :created and :created_by_email, the first will be replaced with $1 so when it gets to the second the colon is gone
    // it will create a param name of $1_by_email which will cause an error.  This is a limitation of the current implementation.

    // Iterate through the parameters and replace the ':' with a '$'
    if (parameters) {
      let i = 1;
      for (let parameter of parameters) {
        parameter.index = i;
        i++;
        // We need to replace the letiable name with the index and we need to do all the replacements in the sql
        let regex = new RegExp(":" + parameter.name, "g");
        sql = sql.replace(regex, '$' + parameter.index);
      }
    }

    // Iterate through the parameters and convert them to the format that PG expects
    let pgParameters = [];
    for (let parameter of parameters) {
      pgParameters.push(parameter.value);
    }

    let result = await (this.pgClient.query(sql, pgParameters));
    return result?.rows;
  }

  async close() {
    console.log('inside close');
    if (this.pgClient) {
      console.log('pg client exists');
      try {
        await this.pgClient.end();
      } catch (e) {
        console.error("Error closing pg client", e);
      }
    }
  }
}

let driver = null;
const getADriver = () => {
  console.log('inside getADriver');
  if (!driver) {
    console.log('driver is null so creating a new one');
    driver = new PGDatabaseDriver();
  }
  return driver;
}

module.exports = {
  DatabaseDriver,
  PGDatabaseDriver,
  getADriver
}