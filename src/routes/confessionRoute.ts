import { Router } from 'express';
import {
    createRecurringConfession,
    deleteRecurringConfession,
    updateRecurringConfession,
    createLiveConfession,
    deleteLiveConfession,
} from '../controllers/confessionController';

const router = Router({ mergeParams: true });

// LIVE CONFESSIONS

const pathLive = '/live';

router.route(pathLive).post(createLiveConfession);

router.route(`${pathLive}/:id`).delete(deleteLiveConfession);

// RECURRING CONFESSIONS

const pathRecurring = '/recurring';

router.route(pathRecurring).post(createRecurringConfession);

router
    .route(`${pathRecurring}/:id`)
    .patch(updateRecurringConfession)
    .delete(deleteRecurringConfession);

export default router;
