import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = process.env.PORT || 5000;
const app = express();
const URL = "https://songapi-au07.onrender.com";


//middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//middleware to parse json
app.use(bodyParser.json());

app.use(express.static('public'));

app.set("view engine", "ejs");

app.get('/home', async (req, res) => {
    const url = `${URL}/api/songs/all`;
    const response = await axios.get(url);
    const result = response.data;
    console.log(result);

    res.render('home.ejs', { result });
});

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/any', async (req, res) => {
    const url = URL+"/api/songs/any";
    const response = await axios.get(url);
    const result = response.data;

    console.log(result);
    res.render('index.ejs', { result });
});

// app.get('/add', (req, res) => {
//     res.render('add.ejs');
// })

// app.post('/add', async (req, res) => {
//     console.log(req.body);

//     // const { day, month, monthNum, year } = req.body; not needed as i've decided for now it is not needed

//     const song = {
//         title: req.body.title,
//         artist: req.body.artist.split(',').toString(),
//         image: req.body.image,
//         stream: req.body.stream
//     };

//     console.log("what you got from the console: ", song);
//     console.log("URL: ", URL);

//     await axios.post(`${URL}/api/songs/add`, song)
//     .then(response => {
//         console.log("song added!", response.data);
//     })
//     .catch(error=> {
//         console.error("error adding item", error);
//     });

//     res.redirect('/');       [not needed for now as i've decided to make it a one page app]
// });

app.listen(port, () => {
    console.log(`app is listening on port ${port}.`);
});