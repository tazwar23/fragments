const testOBJ = require('../../src/model/data/memory/index');

describe('memory-functions-test', () => {
  var metadata = {
    id: 'a',
    ownerId: 'b',
    created: '2021-11-02T15:09:50.403Z',
    updated: '2021-11-02T15:09:50.403Z',
    type: 'text/plain',
    size: 256,
  };
  const metadata2 = {
    id: 'c',
    ownerId: 'b',
    created: '2021-11-03T12:30:00.000Z',
    updated: '2021-11-03T12:30:00.000Z',
    type: 'text/html',
    size: 512,
  };
  test('Write Fragment and get Fragment MetaData', async () => {
    await testOBJ.writeFragment(metadata);
    const result = await testOBJ.readFragment(metadata.ownerId, metadata.id);
    expect(result).toBe(metadata);
  });
  test('Write Fragment and get Fragment', async () => {
    const data = Buffer.from([1, 2, 3]);
    await testOBJ.writeFragmentData(metadata.ownerId, metadata.id, data);
    const result = await testOBJ.readFragmentData(metadata.ownerId, metadata.id);
    expect(result).toBe(data);
  });
  test('Get fragment ids for the given user', async () => {
    await testOBJ.writeFragment(metadata2);
    const data2 = Buffer.from([1, 2, 3, 5]);
    await testOBJ.writeFragmentData(metadata.ownerId, metadata2.id, data2);

    var ans = [metadata.id, metadata2.id];
    const result = await testOBJ.listFragments(metadata.ownerId);

    expect(result).toEqual(ans);
  });
});
