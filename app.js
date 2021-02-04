const express = require('express');
const { projects } = require('./data.json');
const app = express();

app.use('/static', express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', { projects });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/project/:id', (req, res) => {
    let id = req.params.id;
    if( parseInt(id) && parseInt(id) <= (id + 1)) {
        id = parseInt(id);
        res.render('project', { project: projects[id - 1]});
    } else {
        const err = new Error('Not Found');
        err.status = 404;
        err.message = "Page not found";
        console.log(`Error: ${err.message} (${err.status})`);
        next();
    }
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    err.message = "Page not found";
    console.log(`Error: ${err.message} (${err.status})`);
    next();
});

app.use(( err, req, res, next) => {
    res.locals.err = err;
    res.status(err.status);
    console.log(`Error: ${err.message} (${err.status})`);
    next();
});

app.listen(3000, () => {
    console.log('The server is listening on port 3000')
});