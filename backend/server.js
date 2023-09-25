const express = require('express');
const routesReports = require('./routes/routesReports');
const routesUser = require('./routes/routesUser');
const cors = require('cors')

const app = express();
const PORT = 3000;

app.use(express.json());
// enable cors for all requests
app.use(cors());
app.use('/', routesReports);
app.use('/user', routesUser);


app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`server running on http://localhost:${PORT}`);
    }
});
