'use-strict';
const app = require('./app')
// ---- Booting Server ----

// Server Listening on port 3000 on localhost
const port = 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
