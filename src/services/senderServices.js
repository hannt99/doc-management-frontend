import httpRequest from '~/utils/httpRequest';

// Create sender function
export const createSender = async (data = {}) => {
    try {
        const res = await httpRequest.post('/sender/create', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Get all senders function
export const getAllSenders = async () => {
    try {
        const res = await httpRequest.get('/sender/get-all');
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};
