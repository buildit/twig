const PouchDB = require('pouchdb');
const orgModels = require('./organisation-models.json');

const env = process.env.MODE || process.env.NODE_ENV || 'local';
const dbName = 'organisation-models';
let dbURL = '';

switch (env) {
  case 'local':
    dbURL = 'http://localhost:5984';
    break;

  case 'development':
    dbURL = 'https://cklattlenifecomplerstedi:9ebdadbce84b650c3b60facc73361e1606507fb4@shahzain-wipro.cloudant.com';
    break;

  case 'production':
    dbURL = 'http://couchdb.riglet:5984';
    break;

  default:
    dbURL = 'http://localhost:5984';
    break;
}

console.warn(`Using ${env} DB URL: ${dbURL}`);

const db = new PouchDB(`${dbURL}/${dbName}`);

orgModels.forEach(model => {
  db
    .get(model._id)
    .then(doc => {
      if (doc) {
        doc.data = model.data;
        return db.put(doc, doc._rev);
      }
    })
    .catch(error => {
      if (error.status === 404) {
        return db.post(model);
      }
      console.log(error);
    })
    .then(() => {
      console.log(`Organisation ${model._id} migrated successfully.`);
    });
});
