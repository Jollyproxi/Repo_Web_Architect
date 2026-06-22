// index.js
// Entry point: avvia il server HTTP sulla porta configurata.
// Non contiene logica applicativa — quella vive in app.js.

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` \n Server in ascolto su http://localhost:${PORT}`);
  console.log(`   Ambiente : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Risorse  : /api/v1/users | /api/v1/products\n`);
});
