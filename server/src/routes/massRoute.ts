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

router.route('/').get(getAllMasses).post(createMass);

router.route('/:id').get(getMass).patch(updateMass).delete(deleteMass);

export default router;
