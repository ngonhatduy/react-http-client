import axios, { AxiosError, AxiosResponse } from "axios";
axios.defaults.baseURL = 'https://localhost:7246/api/';
//axios.defaults.withCredentials = true;
// Add a request interceptor
// axios.interceptors.request.use(async function (config) {
//     // Do something before request is sent
//     await sleep();
//         return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });
const responseBody = (response: AxiosResponse) => response.data;
const sleep = () => new Promise(resolve => {setTimeout(resolve, 1000)});
axios.interceptors.response.use(async response => {
    await sleep();
    return response
}, (error: AxiosError) => {
    console.log(error)
    return Promise.reject(error.response)
})

const User = {
    getToken: (url: string, data: any, header: any) => axios.post(url, data, header).then(responseBody),
    getUserList: (url: string, header: any) => axios.get(url, header).then(responseBody)
}

const agent = {
    User
}
export default agent;