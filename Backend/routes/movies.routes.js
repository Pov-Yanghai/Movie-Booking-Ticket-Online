import express from 'express';
import { getAllMovies, getMovieById, createMovie } from '../Controllers/movie.controller.js';
import { getMoviesByDay } from '../Controllers/showtimes.controller.js';

const movieRouter = express.Router();

movieRouter.get('/', getAllMovies);
movieRouter.get('/by-day', getMoviesByDay);
movieRouter.get('/:id', getMovieById);
movieRouter.post('/', createMovie);

export default movieRouter;