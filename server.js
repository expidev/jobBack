import express from 'express';
import cors from 'cors';
import jobs from './api/jobs.route.js';
import resume from './api/resume.route.js';

const app = express();

// avoid cors policy
app.use(cors());
app.use(express.json());

app.use("/api/v1/jobs", jobs);
app.use("/api/v1/resume", resume);
app.use('*', (req, res) => {
  res.status(404).json({error: "not found"});
})

export default app;