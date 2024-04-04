// /api/search.js
import fetch from 'node-fetch';

console.log(req.body);


export default async function(req, res) {

    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }

    const { title, fieldOffices, race, weight, age } = req.body;
    const cleanFieldOffices = fieldOffices ? fieldOffices.toLowerCase().replace(/\s/g, '') : ''; // Safely handle potentially undefined fieldOffices
    // Construct the FBI API URL with the specified search parameters
    const apiUrl = `https://api.fbi.gov/@wanted?pageSize=2000&page=1&sort_on=modified&sort_order=desc&title=${title}&field_offices=${cleanFieldOffices}&weight=${weight}&age_min=${age}&age_max=${age}&race=${race}`;

    try {
        // Fetch data from the FBI API
        const fetchData = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Your User Agent String', // Replace with your actual User-Agent
            },
        });

        if (fetchData.ok) {
            const gData = await fetchData.json();

            // Check if there are search results to render
            if (gData && gData.items && gData.items.length > 0) {
                // Respond with JSON data
                res.json(gData.items);
            } else {
                // No search results found
                res.status(404).json({ error: 'No search results found.' });
            }
        } else {
            console.error(`Error fetching data: ${fetchData.status} - ${fetchData.statusText}`);
            res.status(fetchData.status).json({ error: 'Failed to fetch data' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}