import WSResponse from "../libs/WSResponse.js";
import os from 'os';
import yargs from 'yargs/yargs'

const arg = yargs(process.argv.slice(2)).alias({
    u: 'user',
    p: 'password'
}).default({
    port: 8080,
    mode: 'fork',
}).argv

const getServerInfo = async (req, res) => {
    const platform = process.platform;
    const version = process.version;
    const path = process.execPath;
    const pid = process.pid;
    const folder = process.cwd();
    const cpus = os.cpus().length;  
    const args = JSON.stringify(arg);
    const memory = JSON.stringify(process.memoryUsage());
    const database = "MongoDB"

    const data = {
        args,
        platform,
        version,
        memory,
        path,
        pid,
        folder,
        cpus,
        database
    }

    res.json(new WSResponse(data, "success retrieving server info"))
}

export default { getServerInfo }