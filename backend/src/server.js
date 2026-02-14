import express from 'express';
import connectDB from './config/db.js';
import paletteRoutes from "./route/palette.routes.js";
import cors from 'cors'
import dns from "node:dns";

const app = express();
const port = process.env.PORT || 8081;

dns.setServers(["1.1.1.1", "8.8.8.8"]);

await connectDB();

app.get('/', (req, res)=>{
res.send('Heloo World');
})



// app.use(cors({
//   origin: "http://localhost:3000",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));
// app.get("/", (req, res) => {
//   res.send("Backend Running");
// });


app.use(cors());

app.use(express.json());

app.use("/color-palette", paletteRoutes);


app.listen(port, ()=>{
    console.log(`server has started on ${port}`);
})