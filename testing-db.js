const CyclicDB = require("@cyclic.sh/dynamodb");
const db = CyclicDB("important-blue-wrapCyclicDB");
let collection = db.collection('users');
// collection.list().then(result => console.log(result.results));
// collection.get('mike').then(result => console.log(result));
collection.get('mike')
  .then(item => item.fragment('work').get())
  // .then(fragment => fragment[0].get())
  .then(result => console.log(result));
// collection.set('mike', {testing: 'test'}).then(result => console.log(result))
// collection.item('mike').fragment('work').get().then(result => console.log(result));
// collection.item('mike').fragment('work').set({company: 'cyclic'}).then(result => console.log(result));