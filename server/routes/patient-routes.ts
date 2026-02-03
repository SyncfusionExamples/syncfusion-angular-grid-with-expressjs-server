/**
 * Patient Routes
 * Single POST endpoint style (matches working React sample)
 */

import { Router } from 'express';
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  // batchUpdate, getPatientById, getPatientStats  ← add if you need them
} from '../controllers/patients.controller';  // ← .ts extension

const router = Router();

/**
 * Single POST /api/patients – handles ALL Syncfusion UrlAdaptor operations
 * - Read/Query:   { skip, take, requiresCounts, sorted?, where?, search? }
 * - Create:       { value: { ... } }
 * - Update:       { key: id, value: { ... } }
 * - Delete:       { key: id }
 */
router.post('/', (req, res) => {
  const body = req.body || {};

  if ('key' in body) {
    if ('value' in body) {
      // UPDATE
      return updatePatient(req, res);
    } else {
      // DELETE
      return deletePatient(req, res);
    }
  }

  if ('value' in body && !('skip' in body) && !('requiresCounts' in body)) {
    // CREATE
    return createPatient(req, res);
  }

  // READ / QUERY (default)
  return getPatients(req, res);
});

// Optional additional routes (uncomment if needed)
// router.post('/batch', batchUpdate);
// router.get('/:id', getPatientById);
// router.get('/stats', getPatientStats);

export default router;