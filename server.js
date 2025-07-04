import express, { urlencoded } from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan  from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors'
import path from 'path'
import {fileURLToPath} from 'url'
//configure env
dotenv.config();

//database config
connectDB();

//esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const app = express()


//rest object
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'./client/dist')))
// app.use(express.urlencoded({ extended: true })); // parses form submissions

//routes
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product", productRoutes);


//rest api
// app.use('*',(req,res)=>{
//     res.sendFile(path.join(__dirname,'./client/dist/index.html'))
// })


const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server Running On ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white)
})


