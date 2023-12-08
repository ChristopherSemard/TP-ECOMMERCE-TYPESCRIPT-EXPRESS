"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voiture = void 0;
class Voiture {
    constructor(marque, modele, kilometrage, prix, anneeCirculation) {
        this.marque = marque,
            this.modele = modele,
            this.kilometrage = kilometrage;
        this.prix = prix;
        this.anneeCirculation = anneeCirculation;
    }
    displayCar() {
        console.log(`--- ${this.marque} ---\nModèle : ${this.modele.nom} | Serie : ${this.modele.serie} | Moteur : ${this.modele.moteur}\nKilomètrage : ${this.kilometrage} km \n Prix : ${this.prix}€ \n Année de mise en circulation ${this.anneeCirculation}`);
    }
    calculateKmPerYear() {
        console.log(`--- Nombre de kilomètres par an du véhicule ${this.marque} ---\nKilomètre par an : ${this.kilometrage / (2023 - this.anneeCirculation + 1)} km`);
    }
}
exports.Voiture = Voiture;
