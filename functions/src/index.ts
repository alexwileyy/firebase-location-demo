import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();



//Gets a JSON object of all weather
export const getLocation = functions.https.onRequest((req, res) => {

	// Get the location from query params 
	const location = req.query.location ? req.query.location : 'new-york';

    admin.firestore().doc(`cities/${location}`).get()
        .then(snapshot => {
        	// Get Data from Google Cloud
	        const data = snapshot.data();

	        // Create response template
	        let returnResponse = {};
	        returnResponse[location] = data;

	        // Send back to client
	        res.send(returnResponse);
    	})
        .catch(error => {
	        console.log(error);
	        res.status(500).send(error);
    	});
})


export const addLocation = functions.https.onRequest((res, res) => {

});