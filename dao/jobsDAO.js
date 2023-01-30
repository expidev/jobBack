import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;
let jobs;

export default class JobsDAO {
    static async injectDB(conn) {
        if(jobs) return;
        try {
            jobs = await conn.db(process.env.JOB_APP_DB)
                .collection("jobs");
        }
        catch(e) {
            console.error("unable to connect in JobsDAO:" + e)
        }
    }

    static async getJobs({//default filter
        saved = {},
        page = 0,
        jobsperPage = 20, // will only get 20 jobs at once
    } = {}) {
        let cursor;
        try {
            cursor = await jobs
            .find(saved)
            .sort({"date": -1})
            .limit(jobsperPage) 
            .skip(jobsperPage * page);
    
            const jobList = await cursor.toArray();
            return jobList;
        }
        catch(e){
            console.error(`Unable to issue find command, ${e}`);
            return [];
        }
    }

    static async getJobById(id){
        try {
            return await jobs.findOne({
                        _id: new ObjectId(id),
                    });
        } 
        catch (e) {
            console.error(`something went wrong with getMovieById: ${e}`);
            throw e;
        }
    }

    static async addJob(content) {
        try {
            await jobs.insertOne(content);
        }
        catch(e) {
            console.error(`Unable to proceed to post Job: ${e} `);
            return {error: e};
        }
    }

    static async saveJob(jobId) {
        try {
            const currentJob = await jobs.findOne({_id: ObjectId(jobId)});
            currentJob.saved = !currentJob.saved;
            const updateResponse = await jobs.replaceOne(
                {_id: ObjectId(jobId)},
                currentJob
            );

            return updateResponse;
        }

        catch(e) {
            console.error(`unable to update job: ${e}`);
            return {error: e};
        }
    }

    static async deleteJob(jobId) {
        try {
            const deleteResponse = await jobs.deleteOne(
                {_id : ObjectId(jobId)}
            );
            return deleteResponse;
        }

        catch(e) {
            console.error(`Unable to delete post: ${e}`);
            return {error: e};
        }
    }



}
    