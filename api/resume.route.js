import express from 'express';
import resumeController from './resume.controller.js';

const router = express.Router();

router.route('/')
    .get(resumeController.apiGetResume)
    .post(resumeController.apiPostResume);

router.route('/:id')
    .get(resumeController.apiGetResumeById)
    .put(resumeController.apiPutResumeById);

export default router;