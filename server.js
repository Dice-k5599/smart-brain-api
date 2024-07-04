import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";

// importing controllers
import { handleSignin } from "./controllers/signin.js";
import { handleRegister } from "./controllers/register.js";
import { handleProfile } from "./controllers/profile.js";
import { handleAPICall, handleImage } from "./controllers/image.js";
// import { handleAPI } from "./controllers/api.js";

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.EXTERNAL_DATABASE_URL,
      ssl: true,
      // host : '127.0.0.1',
      // port : '5432',
      // user : 'daisukea',
      // password : '',
      // database : 'smart-brain'
    }
  });

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    db.select('*').from('users')
    .then(data => {
        res.json(data);
    })
})

app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { handleProfile(req, res) });

app.put('/image', (req, res) => { handleImage(req, res, db) });

app.post('/api', (req, res) => { handleAPICall(req, res) });

app.listen(4000, () => {
    console.log("app is running on port 4000");
});