const express = require('express');
const router = express.Router();
const comicsController = require('../controllers/comicsController');
const authMiddleware = require('../middleware/authMiddleware');

// Unauthenticated routes
router.get('/', comicsController.getAllComics);
router.get('/:id', comicsController.getComicById);

// Authenticated routes
const authenticatedRouter = express.Router();
authenticatedRouter.use(authMiddleware);
authenticatedRouter.post('/', comicsController.createComic);
authenticatedRouter.put('/:id', comicsController.updateComic);
authenticatedRouter.delete('/:id', comicsController.deleteComic);

// Combine all routes
router.use(authenticatedRouter);

module.exports = router;
