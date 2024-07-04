const handleAPI = (req, res) => {
    res.json(process.env.CLARIFAI_API);
}

export {handleAPI};