import express from 'express';
import usersRoute from './usersRoute.js';
const baseRoute = express.Router();

baseRoute.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy and running'
    });
});

baseRoute.use('/users',usersRoute);

export default baseRoute;
