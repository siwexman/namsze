import express, { Router } from 'express';
import { Church } from '../models/ChurchModel';

const router = express.Router();

// ROUTES
// GET POST All church
router.route('/churches').get().post();

// GET PATCH DELETE One church
router.route('churches/:id').get().patch().delete();

// GET Based on user's localisation all churches
router.route('churches/near-me/:latlng').get();

export default router;
