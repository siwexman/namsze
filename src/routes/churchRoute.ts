import { Router } from 'express';

import {
    createChurch,
    deleteChurch,
    getAllChurches,
    getChurch,
    getChurchesConfessions,
    getNearChurchesMasses,
    updateChurch,
} from '../controllers/churchController';
import { getChurchesByMass } from '../controllers/helpers/churchFactory';

const router = Router();

// ROUTES
// GET POST All church
router.route('/').get(getAllChurches).post(createChurch);

// GET Church and Masses
// GET Churches with masses Based on user's localization
router.route('/near-me/:latlng').get(getNearChurchesMasses);

// GET Churches with masses fitlered by time
router.route('/by-time/:time').get(getChurchesByMass);

// GET Churches with confessions filtered by time
router.route('/confessions/:time').get(getChurchesConfessions);

// GET PATCH DELETE One church
router.route('/:id').get(getChurch).patch(updateChurch).delete(deleteChurch);

// GET One church with masses
// router.route('/:churchId/masses').get(getChurchWithMasses);
// router.use('/:churchId/masses', massRouter);

export default router;
