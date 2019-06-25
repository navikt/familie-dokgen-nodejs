export default (app) => {
    app.get('/', (req, res) => res.status(200).send(
        'Server running.'
    ))
}