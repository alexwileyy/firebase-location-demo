"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
//Gets a JSON object of all weather
exports.getLocation = functions.https.onRequest((req, res) => {
    // Get the location from query params 
    const location = req.query.location ? req.query.location : 'new-york';
    let data = null;
    admin.firestore().doc(`cities/${location}`).get()
        .then(snapshot => {
        // Get Data from Google Cloud
        data = snapshot.data();
        let suburbArray = [];
        data.suburbs.forEach(suburb => {
            const p = admin.firestore().doc(`suburb/${suburb}`).get();
            suburbArray.push(p);
            console.log(`suburb/${suburb}`);
        });
        return Promise.all(suburbArray);
    })
        .then(suburbSnapshots => {
        const results = [];
        suburbSnapshots.forEach((suburb, index) => {
            let template = { suburb: data.suburbs[index] };
            const suburbData = suburb.data();
            data.suburbs[index] = Object.assign(template, suburbData);
            results.push(suburbData);
        });
        res.send(data);
    })
        .catch(error => {
        console.log(error);
        res.status(500).send(error);
    });
});
// Add new locations to the database
exports.addLocation = functions.https.onRequest((req, res) => {
    const body = req.body;
    if (!body.location || !body.population || !body.timezone || !body.country) {
        res.send('Incorrect parameters provided to the API endpoint.');
        return;
    }
    let documentRef = admin.firestore().collection('cities').doc(body.location);
    documentRef.create({
        country: body.country,
        population: body.population,
        timezone: body.timezone
    }).then(doc => {
        console.log('Document created!');
        res.send('Document created');
    }).catch(err => {
        console.log('Error');
        res.send('Error');
    });
});
// Update a document in the database
exports.modifyLocation = functions.https.onRequest((req, res) => {
    const body = req.body;
    const location = req.query.location;
    if (!location || !body.population || !body.timezone || !body.country) {
        res.send('Incorrect parameters provided to the API endpoint.');
        return;
    }
    let documenrRef = admin.firestore().collection('cities').doc(location);
    documenrRef.set(body).then(doc => {
        res.send(`Document ${location} updated!`);
    }).catch(err => {
        res.send(err);
    });
});
//# sourceMappingURL=index.js.map