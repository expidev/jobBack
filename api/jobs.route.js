import express from 'express';
import JobsController from './jobs.controller.js';

const router = express.Router();

router.route('/').get(JobsController.apiGetJobs)
                 .post(JobsController.apiPostJob)
                 .put(JobsController.apiSaveJob)
                 .delete(JobsController.apiDeleteJobById);
router.route('/id/:id').get(JobsController.apiGetJobById);

export default router;