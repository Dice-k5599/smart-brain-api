const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("invalid signin");
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);    // return true if hash matches password
        if (isValid) 
        {
            return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user[0]);
            }) 
            .catch(error => res.status(400).json('unable to get user'));
        }
        else
        {
            return res.status(400).json('wrong credentials');
        }
    })
    .catch(error => res.status(400).json('wrong credentials'));
}

export {handleSignin};