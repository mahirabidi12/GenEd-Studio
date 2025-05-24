import app from './app.js'
import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import connectDb from './config/connectDb.js'

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.listen(process.env.PORT , () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

connectDb()

app.use("/auth" , authRoutes)