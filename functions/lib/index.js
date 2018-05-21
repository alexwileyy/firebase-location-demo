"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//Gets a JSON object of all weather
exports.getWeather = functions.https.onRequest((req, res) => {
    console.log(req.query);
    const location = req.query.location ? req.query.location : 'new-york';
    admin.firestore().doc(`cities/${location}`).get()
        .then(snapshot => {
        const data = snapshot.data();
        let returnResponse = {};
        returnResponse[location] = data;
        res.send(returnResponse);
    })
        .catch(error => {
        console.log(error);
        res.status(500).send(error);
    });
});
//# sourceMappingURL=index.js.map