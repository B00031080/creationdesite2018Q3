const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/mapage', (req, res) => res.send('Tu ne devrais pas être là!!!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));