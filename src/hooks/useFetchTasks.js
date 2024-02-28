import { useState, useEffect } from 'react';
import * as taskServices from '~/services/taskServices';

const useFetchTasks = () => {
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskServices.getAllTask(1, 1, '', '', '', '', '', '', '');
            if (res.code === 200) {
                const userRole = JSON.parse(localStorage.getItem('userRole'));
                if (userRole === 'Admin' || userRole === 'Moderator') {
                    setAllTasks(res.allTasks);
                } else {
                    setAllTasks(res.allMemberTasks);
                }
            } else {
                console.log(res);
            }
        };

        fetchApi();
    }, []);
    return allTasks;
};

export default useFetchTasks;