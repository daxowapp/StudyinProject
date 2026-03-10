const fs = require('fs');
const data = JSON.parse(fs.readFileSync('test-db-size.json', 'utf8'));
const popular = data.filter(p => p.is_popular === true);
const loosepopular = data.filter(p => p.is_popular == true);
const notfalsetest = data.filter(p => !(!p.is_popular || p.is_popular === 'false' || p.is_popular === 0));

console.log("Strict True:", popular.length);
console.log("Loose True:", loosepopular.length);
console.log("Not False:", notfalsetest.length);
