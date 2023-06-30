import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;
let resume;

export default class resumeDAO {
    static async injectDB(conn) {
        if(resume) return;
        try {
            resume = await conn.db(process.env.JOB_APP_DB)
                .collection("resume");
        }
        catch(e) {
            console.error("unable to connect in JobsDAO:" + e)
        }
    }

    static async getResume({//default filter
        page = 0,
        resumePerPage = 20, // will only get 20 jobs at once
    } = {}) {
        let cursor;
        try {
            cursor = await resume
            .find({})
            .sort({"date": -1})
            .limit(resumePerPage) 
            .skip(resumePerPage * page);
    
            const resumeList = await cursor.toArray();
            return resumeList;
        }
        catch(e){
            console.error(`Unable to issue find command, ${e}`);
            const resumeList = [];
            return resumeList;
        }
    }

    static async getResumeById(id) {
        let cursor;
        try {
            cursor = await resume.findOne({'resume_id': id});
            return cursor;
        }
        catch(e){
            console.error(`Unable to issue find command, ${e}`);
            return cursor = {};
        }
    }

    static async addResume(content) {
        try {
            await resume.insertOne(content);
        }
        catch(e) {
            console.error(`Unable to proceed to post Job: ${e} `);
            return {error: e};
        }
    }

    static async updateResume(id, data) {
        try{
            const updatedResponse = await resume.replaceOne(
                {'resume_id': id}, {'content': data}
            );
            return updatedResponse;
        }
        catch(e){
            console.error(`unable to update Resume: ${e}`)
            return { error: e}
        }
    }
}