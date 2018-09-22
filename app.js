const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const body_parser = require('body-parser');
const path = require('path');
const fs = require('fs');

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

//variables
let index = 0, content, id;
content = fs.readFileSync('passwords.txt', 'utf8');
// in passwords.txt file we have all encrypted passwords separted by ","

id = content.split(',').length;

//routes
app.get('/', (req, res) => {
    res.render('index');
});

//encrypt and save password to passwords.txt
app.post('/encrypt', (req, res, next) => {

    //get the actual password input
    let password = req.body.password;
    
    //if password field is blank then redirect to home page
    if(password == '')
    {
        res.redirect('/');
    }

    //encrypt password
    else 
    {
        /*
            to encrypt password : for example 'abc'
            1. we will convert it to an array => ['a', 'b', 'c']
            2. add plus 2 ascii for each word => ['c', 'd', 'e']
            3. add 'x' to first and 'y' to last => ['x', c', 'd', 'e', 'y']
            4. for middle word, subtract 1 ascii for that word => ['x', c', 'c', 'e', 'y']
            5. convert array to string => 'xccey'
        */

        //1.
        password = password.split('');

        //2.
        for(let i = 0; i < password.length; i++)
            password[i] = String.fromCharCode(password[i].charCodeAt(0)+2);
        
        //3.
        password.unshift('x');
        password.push('y');

        //4.
        password[parseInt(password.length/2)] = String.fromCharCode(password[parseInt(password.length/2)].charCodeAt(0)-1);
        
        //5.
        password = password.join('');
        
        //add encrypted password to file [we must use database for this, but this is just a concept]
        fs.appendFile('passwords.txt', password + ',', 'utf8', (err) => {
            id++;
            if(err) throw err;
        });

        content = fs.readFileSync('passwords.txt', 'utf8');
        //set userid as index
        index = content.split(',').length;
        res.redirect('/success');
    }
});

app.get('/success', (req, res) => {
    res.render('success', {
        id : index
    });
});

app.post('/get-password', (req, res) => {
    /*
        to get password we will first get the userid we gave to user and then validate it.
        if user exist then we will give them decrypted password
    */
    id = req.body.user_id;
    if(id == '')
    {
        res.redirect('/');
    }

    else
    {
        content = fs.readFileSync('passwords.txt', 'utf8');
        //if no user exist
        if(id >= content.split(',').length)
        {
            res.redirect('/');
        }
        else
        {
            res.redirect('/decrypt');
        }
    }

});

app.get('/decrypt', (req, res) => {
    content = fs.readFileSync('passwords.txt', 'utf8');
    content = content.split(',');

    //get the encrypted password of user by userid
    let decrypted_password = content[id-1];
    
    //we will reverse the encryption algorithm to decrypt password
    decrypted_password = decrypted_password.split('');
    decrypted_password[parseInt(decrypted_password.length/2)] = String.fromCharCode(decrypted_password[parseInt(decrypted_password.length/2)].charCodeAt(0) + 1);
    decrypted_password.shift();
    decrypted_password.pop();
    for(let i = 0; i < decrypted_password.length; i++)
        decrypted_password[i] = String.fromCharCode(decrypted_password[i].charCodeAt(0)-2);
    decrypted_password = decrypted_password.join('');

    //give a password
    res.render('password', {
        pass : decrypted_password
    });
});

//server
app.listen(port, () => {
    console.log("Server started on " + port);
});