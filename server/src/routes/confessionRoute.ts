import { Router } from 'express';
import {
    createRecurringConfession,
    deleteRecurringConfession,
    updateRecurringConfession,
    createSingleConfession,
    deleteSingleConfession,
} from '../controllers/confessionController';

const router = Router({ mergeParams: true });

// LIVE CONFESSIONS

const pathSingle = '/single';

router.route(pathSingle).post(createSingleConfession);

router.route(`${pathSingle}/:id`).delete(deleteSingleConfession);

// RECURRING CONFESSIONS

const pathRecurring = '/recurring';

router.route(pathRecurring).post(createRecurringConfession);

router
    .route(`${pathRecurring}/:id`)
    .patch(updateRecurringConfession)
    .delete(deleteRecurringConfession);

export default router;
