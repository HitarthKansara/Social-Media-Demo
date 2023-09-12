const { saveDataToJSONFile, getDataFromJSONFile, updateDataToJSONFile } = require('../../helpers/commonFunctionHelper');
const bcrypt = require('bcrypt')

const generateToken = (data, expiresIn) => {
    try {

        let jwt = require('jsonwebtoken');

        return jwt.sign({ email: data.email, first_name: data.first_name, last_name: data.last_name }, process.env.JWT_SECRET, { expiresIn: expiresIn })

    } catch (err) {
        console.log('Error(generateAuthToken): ', err);
    }
};

const registerUser = async (data) => {
    try {

        let filePath = 'storage/userData.json';

        let userData = getDataFromJSONFile(filePath);

        userData = userData.length ? JSON.parse(userData) : [];

        let isUserAlreadyExists = userData.find(x => x.email == data.email);
        if (isUserAlreadyExists) {
            return 1;
        }

        let authToken = generateToken({ email: data.email, first_name: data.first_name, last_name: data.last_name }, '1d');
        let refreshToken = generateToken({ email: data.email, first_name: data.first_name, last_name: data.last_name }, '15d');

        data.auth_token = authToken;
        data.refresh_token = refreshToken;
        data.password = await bcrypt.hash(data.password, 10);

        saveDataToJSONFile(filePath, data);

        return 2;

    } catch (err) {
        console.log('Error(registerUser): ', err);
    }
};

const loginUser = (data) => {
    try {

        let filePath = 'storage/userData.json';

        let userData = getDataFromJSONFile(filePath);

        userData = userData.length ? JSON.parse(userData) : [];

        let userDetails = userData.find(x => x.email == data.email);
        if (!userDetails) {
            return 1;
        }

        if (!bcrypt.compareSync(data.password, userDetails.password)) {
            return 2;
        }

        let authToken = generateToken({ email: data.email, first_name: userDetails.first_name, last_name: userDetails.last_name }, '1d');
        let refreshToken = generateToken({ email: data.email, first_name: userDetails.first_name, last_name: userDetails.last_name }, '15d');

        userDetails.auth_token = authToken;
        userDetails.refresh_token = refreshToken;

        updateDataToJSONFile(filePath, userDetails);

        return 3;

    } catch (err) {
        console.log('Error(loginUser): ', err);
    }
}

module.exports = { registerUser, loginUser, generateToken }