import { Router } from 'express';

import {
    createChurch,
    deleteChurch,
    getAllChurches,
    getChurch,
    getChurchWithMasses,
    getNearChurchesMasses,
    updateChurch,
} from '../controllers/churchController';
import { getChurchesByMass } from '../controllers/helpers/handlerFactory';

const router = Router();

// ROUTES
// GET POST All church
router.route('/').get(getAllChurches).post(createChurch);

// GET PATCH DELETE One church
router.route('/:id').get(getChurch).patch(updateChurch).delete(deleteChurch);

// GET Church and Masses
// GET Churches with masses Based on user's localization
router.route('/near-me/:latlng').get(getNearChurchesMasses);

// GET Churches with masses fitlered by time
router.route('/by-time/:time').get(getChurchesByMass);

// GET One church with masses
router.route('/:churchId/masses').get(getChurchWithMasses);
// router.use('/:churchId/masses', massRouter);

export default router;
