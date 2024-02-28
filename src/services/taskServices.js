import httpRequest from '~/utils/httpRequest';

// Create task function
export const createTask = async (data = {}) => {
    try {
        const res = await httpRequest.post('/task/create', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Get all tasks function
export const getAllTask = async (limit, page, taskName, createdAt, dueDate, type, status, level, progress) => {
    try {
        const res = await httpRequest.get(
            `/task/get-all?limit=${limit}&page=${page}&taskName=${taskName}&createdAt=${createdAt}&dueDate=${dueDate}&type=${type}&status=${status}&level=${level}&progress=${progress}`,
        );
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Get task by id function
export const getTaskById = async (taskId) => {
    try {
        const res = await httpRequest.get(`/task/get/${taskId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Update task function
export const updateTask = async (taskId, data = {}) => {
    try {
        const res = await httpRequest.put(`/task/update/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Upload file of task function
export const uploadFile = async (taskId, data) => {
    try {
        const res = await httpRequest.post(`/task/upload/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Delete attach file of task function
export const deleteFileUrl = async (taskId, data) => {
    try {
        const res = await httpRequest.patch(`/task/delete-file-url/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Change task progress function
export const updateProgress = async (taskId, data = {}) => {
    try {
        const res = await httpRequest.patch(`/task/update-progress/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Change assignee role function
export const changeAssignRole = async (taskId, data) => {
    try {
        const res = await httpRequest.patch(`/task/change-assignee-role/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Undo task function
export const undoTask = async (taskId, data = {}) => {
    try {
        const res = await httpRequest.patch(`/task/undo/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Submit assignment function
export const uploadResource = async (taskId, data) => {
    try {
        const res = await httpRequest.post(`/task/submit/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Delete each attach file of assignment function
export const deleteSubmitFileUrl = async (taskId, data) => {
    try {
        const res = await httpRequest.patch(`/task/delete-submit-file-url/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Un-submit assignment function
export const changeSubmitStatus = async (taskId, data) => {
    try {
        const res = await httpRequest.patch(`/task/un-submit/${taskId}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Delete task function
export const deleteTaskById = async (taskId) => {
    try {
        const res = await httpRequest.delete(`/task/delete/${taskId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

// Delete many tasks function
export const deleteManyTask = async (data = {}) => {
    try {
        const res = await httpRequest.post('/task/delete-many', data);
        return res.data;
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};
