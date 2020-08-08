import Express from 'express';
import DataImportController from './controllers/DataImportController';
import ClassController from './controllers/ClassController';
import StudentController from './controllers/StudentController';
import ReportController from './controllers/ReportController';
import HealthcheckController from './controllers/HealthcheckController';

const router = Express.Router();

router.use('/', DataImportController);
router.use('/', ClassController);
router.use('/', StudentController);
router.use('/', ReportController);
router.use('/', HealthcheckController);

export default router;
