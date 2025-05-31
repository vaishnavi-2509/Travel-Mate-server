import express from 'express'
import { createUser, loginUser, getAllUsers } from '../handlers/userHandlers.js'
import { verifyToken } from '../middleware/verifyAuth.js'


const usersRoute = express.Router();


usersRoute.post('/signup', createUser);
usersRoute.post('/login', loginUser);
usersRoute.get('/allusers', verifyToken, getAllUsers);


export default usersRoute;