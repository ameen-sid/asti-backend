import express from 'express';
import departmentRouter from '../../modules/lms/department/department.routes';
import subDepartmentRouter from '../../modules/lms/sub-department/sub-department.routes';
import sectionRouter from '../../modules/lms/section/section.routes';
import lineRouter from '../../modules/lms/line/line.routes';
import machineRouter from '../../modules/lms/machine/machine.routes';
import { authenticateToken } from '../../middleware/auth.middleware';

const v1Router = express.Router();

v1Router.use('/departments', authenticateToken, departmentRouter);
v1Router.use('/sub-departments', authenticateToken, subDepartmentRouter);
v1Router.use('/sections', authenticateToken, sectionRouter);
v1Router.use('/lines', authenticateToken, lineRouter);
v1Router.use('/machines', authenticateToken, machineRouter);

export default v1Router;