import resumeDAO from '../dao/resumeDAO.js';

export default class resumeController {
    static async apiGetResume(req, res, next) {
        const resumePerPage = req.query.resumePerPage ? parseInt(req.query.resumePerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const resumeList = await resumeDAO.getResume({page, resumePerPage});
        res.json(resumeList);
    }

    static async apiGetResumeById(req, res, next) {
        try{
            let id = req.params.id || {};
            let resume = await resumeDAO.getResumeById(id);
            if(!resume){
                res.status(404).json({ error: "not found"});
                return;
            }
            res.json(resume);
        }
        catch(e){
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiPostResume(req, res, next) {
        try {
            const content = req.body;
            await resumeDAO.addResume(content);
            res.json({ status: 'success'});
        }
        catch(e) {
            res.status(500).json({error: e.message});
        }
    }

    static async apiPutResumeById(req, res, next) {
        try{
            const id = req.params.id || {};
            const data = req.body;
            const response = await resumeDAO.updateResume(id, data);
            const { error } = response;
            if(error){
                res.status.json({error})
            }
            if(response.modifiedCount === 0){
                throw new Error ("unable to update resume. User may not be original poster")
            }
            res.json({ status: "success "})

        }catch(e){
            res.status(500).json({ error: e.message})
        }
    }
}