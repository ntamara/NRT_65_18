const express = require('express');
const app = express();
const oglasiServis = require('oglasi-modul');
const port = 3000;

app.listen(port, ()=>{console.log(`Server listening on port ${port}...`);});
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Index ??
app.get('/', (req, res) => {
    res.send('Working');
});

// Slanje svih oglasa
app.get('/oglasi', (req, res) => {
    res.send(oglasiServis.sviOglasi());
    //console.log(oglasiServis.sviOglasi());
});

// Slanje jednog oglasa
app.get('/oglasi/:id', (req, res) => {
    res.send(oglasiServis.dohvatiOglas(req.params["id"]));
})

// Dodavanje novog oglasa
app.post('/dodajOglas', (req, res) => {
    oglasiServis.novOglas(req.body);
    res.end('ok');
});
 
//Brisanje oglasa 
app.delete('/delete/:id', (req, res) => {
    oglasiServis.obrisiOglas(req.params["id"]);
    res.end('ok');
}); 

//Izmena oglasa
app.post('/izmena/:id', (req, res) => {
    console.log('Request: ' + req.body);
    oglasiServis.izmeniOglas(req.body);
});

//Pretraga po sadrzaju oglasa
app.get('/pretragaPoSadrzaju', (req, res) => {
    res.send(oglasiServis.pretragaPoSadrzaju(req.query["izraz"]));
});

//Filter kategorija
app.get('/filterKategorija', (req, res) => {
    //console.log('kategorija', req.query["kategorija"]);
    res.send(oglasiServis.nadjiPoKategoriji(req.query["kategorija"]));
});
   