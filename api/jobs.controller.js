import JobsDAO from '../dao/jobsDAO.js';

export default class JobsController {
    static async apiGetJobs(req, res, next) {
        const jobsPerPage = req.query.jobsPerPage ? parseInt(req.query.jobsPerPage) : 20;
        const saved = req.query.saved ? {'saved': true} : {};
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const jobsList = await JobsDAO.getJobs({saved, page, jobsPerPage});
        res.json(jobsList);
    }

    static async apiGetJobById(req, res, next) {
        try {
            const id = req.params.id || {};
            const job = await JobsDAO.getJobById(id);
            if(!job) {
                res.status(404).json({ error: "not found"});
                return;
            }
            res.json(job); 
        }
        catch(e) {
            console.log(`api, ${e}`);
            res.status(500).json({error: e});
        }
    }

    static async apiPostJob(req, res, next) {
        try {
            const content = req.body;
            await JobsDAO.addJob(content);
            res.json({ status: 'success'});
        }
        catch(e) {
            res.status(500).json({error: e.message});
        }
    }


    static async apiSaveJob(req, res, next) {
        try {
            const jobId = req.body.id;
            const jobResponse = await JobsDAO.saveJob(jobId);
            const { error } = jobResponse;
            if (error){
                res.status.json({error})
            }
            res.json({ status: "success "});
        }

        catch(e){
            res.status(500).json({ error: e.message})
        }
            
    }

    static async apiDeleteJobById(req, res, next) {
        try {
            const jobId = req.body.job_id;
            await JobsDAO.deleteJob(
                jobId
            );

            res.json({status: "success"});
        }

        catch(e) {
            res.status(500).json({ error: e.message });
        }
    }
}