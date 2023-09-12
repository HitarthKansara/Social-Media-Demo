const fs = require('fs');


const createLocalFile = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.closeSync(fs.openSync(filePath, 'w+'));
            return true;
        }
    } catch (err) {
        console.log('Error(createLocalFile): ', err);
        return false;
    }
};

const saveDataToJSONFile = (filePath, jsonData) => {
    try {

        createLocalFile(filePath);

        let data = getDataFromJSONFile(filePath);
        data = data.length ? JSON.parse(data) : [];

        data.push(jsonData);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return;

    } catch (err) {
        console.log('Error(saveDataToJSONFile): ', err);
    }
};

const updateDataToJSONFile = (filePath, jsonData) => {
    try {

        createLocalFile(filePath);

        let data = getDataFromJSONFile(filePath);
        data = data.length ? JSON.parse(data) : [];

        let matchedUserIndex = data.findIndex(x => x.email == jsonData.email);

        matchedUserIndex !== -1 ? data.splice(matchedUserIndex, 1, jsonData) : data.push(jsonData);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2),);

        return;

    } catch (err) {
        console.log('Error(saveDataToJSONFile): ', err);
    }
};

const getDataFromJSONFile = (filePath) => {
    try {
        let isFileExists = fs.existsSync(filePath);

        let data = isFileExists ? fs.readFileSync(filePath, { encoding: 'utf-8' }) : [];

        return data;

    } catch (err) {
        console.log('Error(getDataFromJSONFile): ', err);
    }
};

const generateToken = (data, expiresIn) => {
    try {

        let jwt = require('jsonwebtoken');

        return jwt.sign({ email: data.email, first_name: data.first_name, last_name: data.last_name }, process.env.JWT_SECRET, { expiresIn: expiresIn })

    } catch (err) {
        console.log('Error(generateAuthToken): ', err);
    }
};


module.exports = { generateToken, getDataFromJSONFile, saveDataToJSONFile, createLocalFile, updateDataToJSONFile };