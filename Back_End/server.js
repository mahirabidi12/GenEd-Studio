import app from './app.js'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import transRoutes from './routes/transRoutes.js'
import connectDb from './config/connectDb.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';

dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,  // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true})) 

app.listen(process.env.PORT , () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

connectDb()

app.use("/auth" , authRoutes)
app.use("/trans" , transRoutes) 