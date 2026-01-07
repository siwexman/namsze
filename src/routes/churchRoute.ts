import { Router } from 'express';

import {
    createChurch,
    deleteChurch,
    getAllChurches,
    getChurch,
    getChurchWithMasses,
    getNearChurchesWtihMasses,
    updateChurch,
} from '../controllers/churchController';

const router = Router();

// ROUTES
// GET POST All church
router.route('/').get(getAllChurches).post(createChurch);

// GET PATCH DELETE One church
router.route('/:id').get(getChurch).patch(updateChurch).delete(deleteChurch);

// GET Based on user's localisation all churches
router.route('/near-me/:latlng/time/:time').get(getNearChurchesWtihMasses);

// GET Church and Masses
router.route('/:churchId/masses').get(getChurchWithMasses);
// router.use('/:churchId/masses', massRouter);

export default router;
