import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();



//Gets a JSON object of all location data and their suburbs
export const getLocation = functions.https.onRequest((req, res) => {

	// Get the location from query params 
	const location = req.query.location ? req.query.location : 'new-york';

	let data = null;

    admin.firestore().doc(`cities/${location}`).get()
    	// Got city
        .then(snapshot => {
        	// Get Data from Google Cloud
	        data = snapshot.data();
	        let suburbArray = [];

	        // Iteate over suburbs from city data
	        data.suburbs.forEach(suburb => {
	        	// Get suburb data from suburb table
	        	const p = admin.firestore().doc(`suburb/${suburb}`).get()
	        	// Push the snapshot to an array
	        	suburbArray.push(p);
	        	console.log(`suburb/${suburb}`);
	        })
	        // Only resolves when all promises in the array have been resolved
	        return Promise.all(suburbArray);
    	})
        // After all suburb data has been fetched
        .then(suburbSnapshots => {
        	// Iterate over the suburbs data returned from the suburb collection
        	suburbSnapshots.forEach((suburb, index) => {
        		// Creeate a JSON template;
        		let template = {suburb: data.suburbs[index]};
        		// Get the suburb data
        		const suburbData = suburb.data();
        		// Merge the JSON template with data from the suburb collection and set it equal to the index of the suburb array
        		data.suburbs[index] = Object.assign(template, suburbData);
        	});
        	// Send the data
        	res.send(data);
        })
        // Catch any errors
        .catch(error => {
	        console.log(error);
	        res.status(500).send(error);
    	});
})


// Add new locations to the database
export const addLocation = functions.https.onRequest((req, res) => {
	const body = req.body;

	if(!body.location || !body.population || !body.timezone || !body.country){
		res.send('Incorrect parameters provided to the API endpoint.');
		return;
	}

	let documentRef = admin.firestore().collection('cities').doc(body.location);

	documentRef.create({
		country: body.country,
		population: body.population,
		timezone: body.timezone
	}).then(doc => {
		console.log('Document created!')
		res.send('Document created');
	}).catch(err => {
		console.log('Error')
		res.send('Error');
	})
})


// Update a document in the database
export const modifyLocation = functions.https.onRequest((req, res) => {

	const body = req.body;
	const location = req.query.location;

	if(!location || !body.population || !body.timezone || !body.country){
		res.send('Incorrect parameters provided to the API endpoint.');
		return;
	}

	let documenrRef = admin.firestore().collection('cities').doc(location);

	documenrRef.set(body).then(doc => {
		res.send(`Document ${location} updated!`);
	}).catch(err => {
		res.send(err);
	})
})
