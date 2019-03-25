import axios from 'axios'

const baseURL = 'https://jsonplaceholder.typicode.com';

export const getPosts = async () => {
    const response = await axios(baseURL+'/posts');
    return response.data;
};

export const getPostById = async (id: number) => {
    const response = await axios(baseURL+'/posts/'+id);
    return response.data;
};

export const getCommentsById = async (id: number) => {
    const response = await axios.get(baseURL+'/comments?postId='+id);
    return response.data;
};