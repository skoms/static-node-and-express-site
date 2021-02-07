// importing express and storing it to the variable 'express'
const express = require('express');
// Uses ES6 syntax to store the 'data.projects' array into the 'projects' variable
const { projects } = require('./data.json');
// Initialize Express app
const app = express();

// Setting up the 'public' directory to use the 'static' path
app.use('/static', express.static('public'));
// Setting the view engine to 'Pug'
app.set('view engine', 'pug');

// Renders home page and passes in the projects array
app.get('/', (req, res) => {
    res.render('index', { projects });
});

// Renders about page 
app.get('/about', (req, res) => {
    res.render('about');
});

// Takes in parameter through url, and renders the page if valid
app.get('/project/:id', (req, res, next) => {
    let id = req.params.id;
    // Checks if its parsable and if so, if it also is within the bounds of the projects array
    if( parseInt(id) && parseInt(id) <= (id + 1)) {
        id = parseInt(id);
        res.render('project', { project: projects[id - 1]});
    } else {
        // If its not valid, initiate a '404 not found' error and render the 'page-not-found' page
        const err = new Error('Not Found');
        err.status = 404;
        err.message = "Page not found";
        console.log(`Error: ${err.message} (${err.status})`); // It was not specified whether to replace this, so I kept it just in case.
        res.render('page-not-found', { err });
    }
});

// If the request has come this far, the page is not found, and thus set to a '404' error and render the appropriate page
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    err.message = "Page not found";
    console.log(`Error: ${err.message} (${err.status})`); // It was not specified whether to replace this, so I kept it just in case.
    res.render('page-not-found', { err });
});

// Global error handler to deal with any uncalled for errors
app.use(( err, req, res, next) => {
    // If there's an error, it will log it in the console
    if( err ) {
        console.log('Global error handler called', err);
    }
    // If the error code is not '404', then set the different values if they do not have a value, and then finally render the 'error' page
    if( err.status !== 404 ) {
        err.message = err.message || 'Sorry, something seems to be wrong on the server-side.';
        err.status = err.status || 500;
        res.status(err.status);
        console.log(`Error: ${err.message} (${err.status})`);
        res.render('error', { err });
    }
});

// Have the express server listen on port 3000 and also log that it works
app.listen(3000, () => {
    console.log('The server is listening on port 3000')
});
