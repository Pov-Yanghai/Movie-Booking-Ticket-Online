import express from 'express';
import { getAllMovies, getMovieById, createMovie } from '../Controllers/movie.controller.js';

const movieRouter = express.Router();

movieRouter.get('/', getAllMovies);
movieRouter.get('/:id', getMovieById);
movieRouter.post('/', createMovie);

export default movieRouter;