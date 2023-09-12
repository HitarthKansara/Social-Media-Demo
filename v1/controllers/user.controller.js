let { registerUser, loginUser } = require('../services/user.service');

module.exports = {
    register: async function (req, res) {
        try {

            let reqBody = req.body;

            let { email, first_name, last_name, password } = reqBody;

            let response = await registerUser({ email, first_name, last_name, password });

            if (response == 1) {
                return res.status(400).send({ message: 'This email already exists' });
            }

            return res.status(200).send({ message: 'User registered successfully' });

        } catch (err) {
            console.log('Error(register): ', err);
            return res.status(500).send({ message: 'Server is not responding. Please contact administrator', error: err });
        }
    },

    login: async function (req, res) {
        try {

            let reqBody = req.body;

            let { email, password } = reqBody;

            let response = loginUser({ email, password });

            if (response == 1) {
                return res.status(400).send({ message: 'User data not found' });
            }
            if (response == 2) {
                return res.status(400).send({ message: 'Email or password is incorrect' });
            }

            return res.status(200).send({ message: 'User logged in successfully' });

        } catch (err) {
            console.log('Error(register): ', err);
            return res.status(500).send({ message: 'Server is not responding. Please contact administrator', error: err });
        }
    }
}