const csvFilePath='dummyFile.csv'
const csv=require('csvtojson')

const express = require('express')
const bodyParser = require('body-parser')
const { Client } = require('pg');

const client = new Client({
    user: 'me',
    host: 'localhost',
    database: 'csvtojson',
    password: 'admin',
    port: 5432,
})
const execute = async (query) => {
    try {
        await client.connect();     // gets connection
        await client.query(query);  // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await client.end();         // closes connection
    }
};


const app = express()
const port = process.env.port || 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

const text = ` CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "age" int(4) NOT NULL,
    "address" jsonb NULL,
    "gender" VARCHAR(10) NOT NULL
);`;

execute(text).then(result => {
    if (result) {
        console.log('Table created');
    }
}).catch((e)=>{
    console.log(e);
});



app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})


csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach((element)=>{
        // console.log(element.address)
        console.log(element.name.firstName+ ' '+ element.name.lastName,element.age,element.address,element.gender);

        client.query('INSERT INTO users (name, age,address,gender) VALUES ('+ element.name.firstName+ ' '+ element.name.lastName,element.age,element.address,element.gender+')', (error, results) => {
            if (error) {
              throw error
            }
            const query = client.query('select count(age) from users where age < 20');
            const query1 = client.query('select count(age) from users where age BETWEEN 20 AND 40');
            const query2 = client.query('select count(age) from users where age BETWEEN 40 and 60');
            const query3 = client.query('select count(age) from users where age > 60');
            let table = '<table><tr><th>Age-Group</th><th>% Distribution</th></tr><tr><td> <20 </td><td> '+qyery+' </td></tr><tr><td> 20 to 40 </td><td> '+qyery+' </td></tr><tr><td> 40 to 60 </td><td> '+qyery+' </td></tr><tr><td> >60 </td><td> '+qyery+' </td></tr></table>';
            console.log(table,'table!!!!');
            response.status(201).send(`User added with ID: ${results.rows[0].id}`)
          })
    })
})