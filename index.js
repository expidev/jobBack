import app from './server.js';
import mongodb from 'mongodb';
import JobsDAO from './dao/jobsDAO.js';
import dotenv from 'dotenv';
import resumeDAO from './dao/resumeDAO.js';

async function main() {
    // load config from dotenv
    dotenv.config();

    const client = new mongodb.MongoClient(process.env.JOB_DB_URI,
        {useNewUrlParser: true, useUnifiedTopology: true}
    );
    const port = process.env.PORT || 8000;

    try {
        await client.connect();
        console.log("connected to database")
        await JobsDAO.injectDB(client);
        await resumeDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`Serving running on port: ${port}`);
        });
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);