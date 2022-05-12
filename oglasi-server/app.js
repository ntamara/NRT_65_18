const express = require('express');
const app = express();
const oglasiServis = require('oglasi-modul');

app.listen(3000, ()=>{console.log('Listening...');});
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Index ??
app.get('/', (req, res) => {
    res.send('Working');
});

// Slanje svih oglasa
app.get('/oglasi', (req, res) => {
    res.send(oglasiServis.sviOglasi());
});

// Dodavanje novog oglasa
app.post('/dodajOglas', (req, res) => {
    oglasiServis.novOglas(req.body);
    console.log('req.body: ', req.body);
    res.end('ok');
});

//Brisanje oglasa 
app.delete('/delete/:id', (req, res) => {
    oglasiServis.obrisiOglas(req.params["id"]);
    res.end('ok');
});

//Izmena oglasa
app.put('/izmena/:id', (req, res) => {
    oglasiServis.izmeniOglas(req.body);
    res.end('ok');
});

