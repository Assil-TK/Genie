import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server'; // Corrigez cette importation
import {Home} from './src/pages/Home'; 

const app = express();

app.use(express.static('./build', {index: false }))

app.get('/*', (req, res) => {
    const reactApp = renderToString(
        <Home/>
        //<h1>Hello from the server side!</h1>
    );
    return res.send(`
        <html>
            <body>
                <div id="root">${reactApp}</div>
            </body>
        </html>
    `);
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
