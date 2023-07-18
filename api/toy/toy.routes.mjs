import express from 'express'
import {
  requireAuth,
  requireAdmin,
} from '../../middlewares/requireAuth.middleware.mjs'
import { log } from '../../middlewares/logger.middleware.mjs'
import {
  getToys,
  getToyById,
  addToy,
  updateToy,
  removeToy,
  addToyMsg,
  removeToyMsg,
} from './toy.controller.mjs'

const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getToys)
router.get('/:id', getToyById)
router.post('/', requireAuth, addToy)
router.put('/:id', requireAuth, updateToy)
router.delete('/:id', requireAuth, removeToy)
// router.delete('/:id', requireAuth, requireAdmin, removeToy)

router.post('/:id/msg', requireAuth, addToyMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)

export const toyRoutes = router
