const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
        return res.status(400).json("incorrect registeration form");
    }
    // code for generating hash
    // this is an asyn function
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            // this will ensure that when inserting hash and email to login table fails
            // then then the information that was going to be in the users table won't get inserted.
            // this will avoid unmatching data that exist on one table but not on the other. 
            //  - we use 'trx' instead of db inside of this function
            let userExist;
            db.select('*').from('users').where('email', '=', req.body.email).then(data => {
                // console.log(data);
                if(data.length === 0)
                {
                    userExist = false;
                }
                else
                {
                    userExist = true;
                }
            })

            if (userExist === true)
            {
                return res.status(400).json("unable to register");
            }
            else 
            {
                db.transaction(trx => {
                    trx.insert({
                        hash: hash,
                        email: email
                    })
                    .into('login')
                    .returning('email')
                    .then(loginEmail => {
                        return trx('users')
                            .returning('*')
                            .insert({
                                email: loginEmail[0].email,
                                name: name,
                                joined: new Date()
                            })
                            .then(user => {
                                res.json(user[0]);
                            })
                    })
                    .then(trx.commit)
                    .catch(trx.rollback); 
                })
                .catch(error => res.status(400).json('unable to register user'));
            }
        })
    });
}

export {handleRegister};