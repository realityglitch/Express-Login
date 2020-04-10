const express = require('express');
const app = express();
const path = require('path');
const jsonData = require('./JsonData/user-data.json');
const fs = require('fs');
const hbs = require('express-handlebars');

app.use('/register-screen',express.static(path.join(__dirname,'public')));
app.use('/login-screen',express.static(path.join(__dirname,'login')));
app.use('/profile-screen',express.static(path.join(__dirname,'profile')));
app.use('/update-screen',express.static(path.join(__dirname,'update')));

app.use(express.urlencoded());
app.engine('hbs', hbs({extname: 'hbs',defaultLayout: 'user', layoutsDir: path.join(__dirname,'views')}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.get('/', (req, res)=>{
    return es.send(`
    <h1> Server up and running </h1>
    `);
});

app.post('/register', (req , res)=>{
    jsonData.data.push(req.body);
    console.log(jsonData);
    
    fs.writeFileSync('./JsonData/user-data.json', JSON.stringify(jsonData));
   return res.send('OK');
});

app.post('/login',(req , res)=>{
    for(const obj of jsonData.data){
        if(req.body.username === obj.username && req.body.password === obj.password){
                // res.status(200).send(`Welcome ${req.body.username} from ${obj.city}`);
                return res.render('user', {
                    username: obj.username,
                    phone: obj.phone,
                    city: obj.city
                });

        }
    }
   return res.status(404).send('<h1> NOT Found </h1>');
});

app.post('/update',(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    for( let i =0; i < jsonData.data.length ; i++){
        if(jsonData.data[i].username === username && jsonData.data[i].password === password){
            jsonData.data[i].username = username;
            jsonData.data[i].password = password
            jsonData.data[i].city = req.body.city;
            jsonData.data[i].phone = req.body.phone;
        }
    }
    fs.writeFileSync('./JsonData/user-data.json', JSON.stringify(jsonData));
   return res.send('Updated');
});

app.listen(3000, ()=>{
    console.log('Server started on port 3000');
});
