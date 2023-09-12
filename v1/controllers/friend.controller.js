const moment = require('moment');
const { getDataFromJSONFile, saveDataToJSONFile } = require('../../helpers/commonFunctionHelper');
const constants = require('../../config/constants');

const sendFriendRequest = async (req, res) => {
    try {

        let friendId = req.params.email;

        let userData = getDataFromJSONFile('storage/userData.json');

        userData = userData.length ? JSON.parse(userData) : [];

        let currentUser = userData.find(y => y.email == req.user.email);

        let userDetails = userData.find(x => x.email == friendId);

        if (!userDetails) {
            return res.status(400).send({ message: 'User not found' });
        }

        let friendRequestData = getDataFromJSONFile('storage/friendRequestData.json');

        friendRequestData = friendRequestData.length ? JSON.parse(friendRequestData) : [];

        let isRequestAlreadyExists = friendRequestData.find(x => x.email == currentUser.email && x.requested_to.email == userDetails.email);
        if (isRequestAlreadyExists) {
            return res.status(200).send({ message: 'Friend request already sent' });
        }

        let requestData = {
            email,
            first_name,
            last_name,
            requested_to: userDetails.email,
            requested_at: +moment().format('X'),
            status: constants.FRIEND_REQUEST_STATUS.PENDING
        };

        saveDataToJSONFile('storage/friendRequestData.json', requestData);

        return res.status(200).send({ message: 'Friend request sent successfully' });

    } catch (err) {
        console.log('Error(sendFriendRequest): ', err);
    }
}

function paginate(data, page, dataPerPage) {
    const startIndex = (page - 1) * dataPerPage;
    const endIndex = startIndex + dataPerPage;

    if (startIndex >= data.length) {
        return [];
    }

    return data.slice(startIndex, endIndex);
}

const getFriendRequestList = async (req, res) => {
    try {

        let { page, limit } = req.query;

        page = +page || constants.PAGE;
        limit = +limit || constants.LIMIT

        let friendRequestData = getDataFromJSONFile('storage/friendRequestData.json');

        friendRequestData = friendRequestData.length ? JSON.parse(friendRequestData) : [];


        let friendRequestList = friendRequestData.filter(x => x.email == currentUser.email).map(y => y.requested_to && y.requested_at && y.status);


        friendRequestList = paginate(friendRequestList, page, limit);

        let data = {
            data: friendRequestList,
            page: page,
            limit: limit
        };

        return res.status(200).send({ message: 'Friend request get list', data: data });

    } catch (err) {
        console.log('Error(getFriendRequestList): ', err);
    }
}

const friendRequestUpdate = async (req, res) => {
    try {

        let { email, status } = req.params;

        let friendRequestData = getDataFromJSONFile('storage/friendRequestData.json');

        friendRequestData = friendRequestData.length ? JSON.parse(friendRequestData) : [];

        let friendRequestIndex = friendRequestData.findIndex(x => x.email == currentUser.email);


        let friendRequestDetails = friendRequestData[friendRequestIndex];

        friendRequestDetails.status = status;

        friendRequestData.splice(friendRequestIndex, 1, friendRequestDetails);

        saveDataToJSONFile('storage/friendRequestData.json', friendRequestData);

        return res.status(200).send({ message: 'Friend request updated successfully', data: data });

    } catch (err) {
        console.log('Error(friendRequestUpdate): ', err);
    }
}


const friendsList = async (req, res) => {
    try {

        let { page, limit } = req.query;

        page = +page || constants.PAGE;
        limit = +limit || constants.LIMIT

        let friendRequestData = getDataFromJSONFile('storage/friendRequestData.json');

        friendRequestData = friendRequestData.length ? JSON.parse(friendRequestData) : [];


        let friendRequestList = friendRequestData.filter(x => x.email == currentUser.email && x.status == constants.FRIEND_REQUEST_STATUS.ACCEPTEDs).map(y => y.requested_to);

        friendRequestList = paginate(friendRequestList, page, limit);


        let friendsData = getDataFromJSONFile('storage/userData.json');

        friendsData = friendsData.length ? JSON.parse(friendsData) : [];

        friendsData = friendsData.filter(x => friendRequestList.includes(x.email)).map(x => x.first_name && x.last_name && x.email);

        let data = {
            data: friendsData,
            page: page,
            limit: limit
        };

        return res.status(200).send({ message: 'Friend get list', data: data });

    } catch (err) {
        console.log('Error(friendsList): ', err);
    }
}

module.exports = { sendFriendRequest, getFriendRequestList, friendRequestUpdate, friendsList };