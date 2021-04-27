const exec = require('child_process').exec;
const cron = require('node-cron');

const dotenv = require('dotenv');
dotenv.config();

const username = process.env.DB_USER;
const database = process.env.DB_NAME;
const pgpsw = process.env.PGPASS
const date = new Date();

const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;

const fileName = `database-backup-${currentDate}.tar`;
const fileNameGzip = `${fileName}.tar.gz`;

function script() {
    exec(
        `set PGPASSWORD=${pgpsw}&& pg_dump -U ${username} -h localhost -d ${database} -f ${fileName} -F t`,
        (error, stdout, stderr) => {
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
            console.log('Backup complete!', stdout)
        }
    );
}



function restore() {
    execute(`pg_restore - cC - d ${database} ${fileNameGzip}`)
        .then(async () => {
            console.log("Restored");
        }).catch(err => {
            console.log(err);
        })
}

function startSchedule() {
    cron.schedule('0 */2 * * *', () => {
        script();
    }, {});
}

module.exports = {
    startSchedule
}
