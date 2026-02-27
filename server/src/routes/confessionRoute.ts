import { Router } from 'express';
import {
    createRecurringConfession,
    deleteRecurringConfession,
    updateRecurringConfession,
    createSingleConfession,
    deleteSingleConfession,
} from '../controllers/confessionController';
import { restrictTo } from '../controllers/authController';

const router = Router({ mergeParams: true });

// LIVE CONFESSIONS

const pathSingle = '/single';

router.route(pathSingle).post(restrictTo('user'), createSingleConfession);

router
    .route(`${pathSingle}/:id`)
    .delete(restrictTo('user'), deleteSingleConfession);

// RECURRING CONFESSIONS

const pathRecurring = '/recurring';

router.route(pathRecurring).post(restrictTo('user'), createRecurringConfession);

router
    .route(`${pathRecurring}/:id`)
    .patch(restrictTo('user'), updateRecurringConfession)
    .delete(restrictTo('user'), deleteRecurringConfession);

export default router;
