const fs = require('fs');
const path = 'oglasi.json';

let snimiOglase = (data) => {
    fs.writeFileSync(path, JSON.stringify(data));
};

exports.sviOglasi = () => {
    let oglasi = fs.readFileSync(path, (err,data) => {
        if(err) throw err;
        return data;
    })
    return JSON.parse(oglasi);
};

exports.novOglas = (novOglas) => {
    let id = 1;
    let oglasi = this.sviOglasi();
    if(oglasi.length > 0){
        id = oglasi[oglasi.length-1].id+1;
    }
    novOglas.id = id;
    oglasi.push(novOglas);
    snimiOglase(oglasi);
};

exports.dohvatiOglas = (id) => {
    return this.sviOglasi().find(x => x.id == id);
}

exports.obrisiOglas = (id) => {
    return (this.sviOglasi().filter(oglas=>oglas.id!=id));
}

exports.izmeniOglas = (oglas) => {
    this.obrisiOglas(oglas.id);
    this.novOglas(oglas);
}

exports.nadjiPoKategoriji = (kategorija) => {
    return this.sviOglasi().filter(oglas=>oglas.kategorija == kategorija);
} 

exports.listaKategorija = () => {
    let kategorije = [];
    this.sviOglasi().forEach(element => {
        kategorije.push(element.kategorija)
    });
    return kategorije;
}
