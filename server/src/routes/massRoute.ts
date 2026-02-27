import { Router } from 'express';
import {
    createMass,
    deleteMass,
    getAllMasses,
    getMass,
    updateMass,
} from '../controllers/massController';
import { restrictTo } from '../controllers/authController';

const router = Router({ mergeParams: true });

router.route('/').get(getAllMasses).post(restrictTo('user'), createMass);

router
    .route('/:id')
    .get(getMass)
    .patch(restrictTo('user'), updateMass)
    .delete(restrictTo('user'), deleteMass);

export default router;
