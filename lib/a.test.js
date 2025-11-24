const { insert} = require('./utils');
const data = require('./body.mock.json');

describe('a', () => {
  it('should work', done => {
    insert(data)
      .then(done);
  });
});
