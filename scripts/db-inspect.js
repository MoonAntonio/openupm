// Database inspector.

const config = require('config');
const knex = require('../app/db/postgres');

// Print relation records.
const inspect = async function (relation, ids) {
  let query = knex(relation).select();
  if (ids !== null && ids.length)
    query.whereIn('id', ids);
  let rows = await query;
  for (let row of rows) {
    console.log(row);
  }
};

if (require.main === module) {
  let program = require('commander');
  let relationVal = null;
  let idVals = null;
  program
    .arguments('<relation> <id...>')
    .action(function (relation, ids) {
      relationVal = relation;
      idVals = ids.map(x => parseInt(x)).filter(x => !isNaN(x));
    })
    .parse(process.argv);
  if (relationVal === null || idVals === null) {
    program.outputHelp();
    process.exit(1);
  } else {
    inspect(relationVal, idVals)
      .catch(console.log)
      .finally(() => process.exit(0));
  }
}