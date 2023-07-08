const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const md5 = require('md5');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('DB connected successfully!'))
    .catch((err) => console.log(err));

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        require: true
    }
});

const User = mongoose.model("User", userSchema);

app.post("/login", (req, res) => {
    const {email, password} = req.body;

    const pwd = md5(password);

    console.log(req.body);

    User.findOne({email: email})
        .then((user) => {

            console.log(user);
            if(user) {
                if(user.password === pwd)
                    res.send({
                        'status': 'Logged in successfully!',
                        'user': user
                    });
                else
                    res.send({'status':'Invalid credentials!'});
            } else {
                res.send({'status': "User doesn't exists!"});
            }
        })
        .catch((err) => console.log(err));
});

app.post("/register", (req, res) => {
    const {name, email, password, mobile} = req.body;

    const user = User({
        name: name,
        email: email,
        password: md5(password),
        mobile: mobile
    });

    user.save()
        .then(() => res.send('Registered successfully!'))
        .catch((err) => res.send(err));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
