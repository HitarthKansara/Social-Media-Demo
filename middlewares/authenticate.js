const jwt = require('jsonwebtoken');
const { getDataFromJSONFile } = require('../helpers/commonFunctionHelper');

const authenticate = async (req, res, next) => {
    try {

        if (!req.header('Authorization')) return res.status(401).send({ message: 'Unauthorized please login' });

        const token = req.header('Authorization')?.toString().replace('Bearer ', '');
        if (!token) return res.status(400).send({ message: 'Unauthorized please login' });

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('decoded :>> ', decoded);

        let userData = getDataFromJSONFile('storage/userData.json');

        userData = userData.length ? JSON.parse(userData) : [];

        const user = userData.find(x => x.auth_token == token);

        if (!user) return res.status(401).send({ message: 'Unauthorized please login' });

        req.token = token;
        req.user = user;

        next();
    } catch (err) {
        console.log('Error(authenticate): ', err);
        return res.status(500).send({ message: 'Server is not responding', error: err });
    }
};

module.exports = { authenticate }