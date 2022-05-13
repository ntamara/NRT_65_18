const express = require('express');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 5000;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));     
app.listen(port, () => {console.log(`Client listening on port ${port}...`);});

let readView = (viewName) => {
    return fs.readFileSync(path.join(__dirname+'/view/'+viewName+'.html'),'utf-8');
}
let readViewId = (viewName) => {
    return fs.readFileSync(path.join(__dirname+'/view?id='+viewName),'utf-8');
}

//Redirect
app.get('/', (req, res) => {
    res.redirect('/oglasi');
});

// Glavni prikaz - svi oglasi
app.get('/oglasi', (req, res) => {
    axios
    .get('http://localhost:3000/oglasi')
    .then( r => {
        let prikaz = "";
        let oglasi = r.data;
        for(const oglas of oglasi){
            prikaz += `
                <tr>
                    <td><a href="/oglasi/${oglas.id}">${oglas.tekst}</a></td>
                    <td>${oglas.kategorija}</td>
                    <td>${oglas.cena[0].vrednost} ${oglas.cena[0].valuta}</td>
                    <td>${oglas.datum_isteka}</td>
                    <td><a href="/delete/${oglas.id}">Obrisi</a></td>
                    <td><a href="/izmeniOglas/${oglas.id}">Izmeni</a></td>
                </tr>
            `;
        };
        //console.log('Oglasi: ' + oglasi[1].email[0].tip);
        res.send(readView('index').replace('#{data}',prikaz));
    })
    .catch(err => {
        console.log(err);
    })
})

// Prikaz pojedinacnog oglasa 
app.get('/oglasi/:id', (req, res) => {
    axios
    .get(`http://localhost:3000/oglasi/${req.params["id"]}`)
    .then( r => {
        let oglas = r.data;
        let prikaz = `
            <h2>${oglas.tekst}</h2>
            <p>Kategorija: ${oglas.kategorija}</p>
            <p>Cena: ${oglas.cena[0].vrednost} ${oglas.cena[0].valuta}</p>
            <p>Datum isteka oglasa: ${oglas.datum_isteka}</p>
            <p>Kontakt: ${oglas.email[0].adresa}</p>
            <p>Tagovi: ${oglas.tagovi}</p>
        `;
        res.send(readView(':id').replace('#{data}', prikaz));        
    })
    .catch(err => {
        console.log(err);
    });
});

// Brisanje oglasa
app.get('/delete/:id', (req, res) => {
    axios
    .delete(`http://localhost:3000/delete/${req.params["id"]}`)
    .catch(err => {
        console.log(err);
    })
    res.redirect('/oglasi');
})

// Forma za dodavanje novog oglasa
app.get('/dodajOglas', (req, res) => {
    res.send(readView('dodavanje'));
});

// Dodavanje novog oglasa
app.post('/noviOglas', (req, res) => {
    
    let oglas = {
        "kategorija":req.body.kategorija,
        "datum_isteka":req.body.datum_isteka,
        "cena": [{
            "valuta":req.body.valuta,
            "vrednost":parseInt(req.body.vrednost)
        }],
        "tekst":req.body.tekst,
        "tagovi":req.body.tagovi.split(","),
        "email":[{
            "tip":req.body.tip,
            "adresa":req.body.adresa
        }]
    }
    axios.post("http://localhost:3000/dodajOglas",oglas)
    res.redirect('/oglasi');
    //console.log(req.body);
});

//Forma za izmenu postojeceg oglasa
app.get('/izmeniOglas/:id', (req, res) => {
    axios
    .get(`http://localhost:3000/oglasi/${req.params["id"]}`)
    .then(r => {
        let id = req.params["id"];
        let oglas = r.data;
        let datum = oglas.datum_isteka;
        let cena = oglas.cena[0].vrednost;
        let adresa = oglas.email[0].adresa;
        let tekst = oglas.tekst;
        let tagovi = oglas.tagovi;

        console.log('Oglas data:' + oglas);
        res.send(readView('izmena')
        .replace('#{datum}',datum)
        .replace('#{cena}', cena)
        .replace('#{adresa}', adresa)
        .replace('#{tekst}', tekst)
        .replace('#{tekst}', tekst)
        .replace('#{tagovi}', tagovi)
        .replace('#{id}', id)
        );
    })
    .catch(err => {
        console.log(err);
    })
});

//Izmena oglasa
app.post('/izmeniOglas/:id', (req, res) => {
    let oglas = {
        "id": req.params["id"], 
        "kategorija":req.body.kategorija,
        "datum_isteka":req.body.datum_isteka,
        "cena": [{
            "valuta":req.body.valuta,
            "vrednost":parseInt(req.body.vrednost)
        }],
        "tekst":req.body.tekst,
        "tagovi":req.body.tagovi.split(","),
        "email":[{
            "tip":req.body.tip,
            "adresa":req.body.adresa
        }]
    }
    axios
    .post(`http://localhost:3000/izmena/${req.params["id"]}`,oglas)
    .then(r => {
        console.log(r);
    })
    .catch(err => {
        console.log(err);
    })
    res.redirect('/oglasi');    
})

//Pretraga po sadrzaju oglasa
app.post("/pretragaPoSadrzajuOglasa", (req, res) => {
    axios
    .get(`http://localhost:3000/pretragaPoSadrzaju/?izraz=${req.body.izraz}`)
    .then(r => {
        let prikaz = "";
        let oglasi = r.data;
        for(const oglas of oglasi){
            prikaz += `
                <tr>
                    <td><a href="/oglasi/${oglas.id}">${oglas.tekst}</a></td>
                    <td>${oglas.kategorija}</td>
                    <td>${oglas.cena[0].vrednost} ${oglas.cena[0].valuta}</td>
                    <td>${oglas.datum_isteka}</td>
                    <td><a href="/delete/${oglas.id}">Obrisi</a></td>
                    <td><a href="/izmeniOglas/${oglas.id}">Izmeni</a></td>
                </tr>
            `;
        };
        res.send(readView('index').replace('#{data}',prikaz));
    })
    .catch(err => {
        console.log(err);
    })
})

// Pretraga po kategoriji
app.post('/filterKategorija', (req, res) => {
    let kat = req.body.kategorija;
    //console.log('kategorija: ' + kat);
    axios
    .get(`http://localhost:3000/filterKategorija/?kategorija=${kat}`)
    .then(r => {
        let prikaz = "";
        let oglasi = r.data;
        for(const oglas of oglasi){
            prikaz += `
                <tr>
                    <td><a href="/oglasi/${oglas.id}">${oglas.tekst}</a></td>
                    <td>${oglas.kategorija}</td>
                    <td>${oglas.cena[0].vrednost} ${oglas.cena[0].valuta}</td>
                    <td>${oglas.datum_isteka}</td>
                    <td><a href="/delete/${oglas.id}">Obrisi</a></td>
                    <td><a href="/izmeniOglas/${oglas.id}">Izmeni</a></td>
                </tr>
            `;
        };
        res.send(readView('index').replace('#{data}',prikaz));
    })
    .catch(err => {
        console.log(err);
    })
});

