
function insert(body){

  const { time, deviceInfo: { devEui }, data } = body;

  console.log('time', time, 'devEui', devEui, 'data', data);

  const dataDecoded = Buffer.from(data, 'base64').toString('utf8');
  console.log('dataDecoded', dataDecoded);

  const pg = require('pg');

  const client = new pg.Client({
    user: 'tsdbadmin',
    host: 'lwevgo6wge.cd63s5urs1.tsdb.cloud.timescale.com',
    database: 'tsdb',
    password: 'k0z3ddzlwpym9cy3',
    port: 37881,
    ssl: true,
    debug: true
  });

  return client.connect()
    .then(() => {
      return client.query(`
        INSERT INTO events 
          (time, eui, data) 
        VALUES 
          ( $1, $2, $3 )
        `,
        [time, devEui, dataDecoded]
      );
    })
    .then(() => {
      return client.end();
    })
    .catch(e => {
      console.error(e);
      throw e;
    });

}

module.exports = {
  insert
}
