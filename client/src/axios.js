import axios from 'axios';

export let BASE_ENDPOINT = '';
//BASE_ENDPOINT = 'https://api.dev.somethingserver.xyz';
// when developing locally, change this value to local
export const APP_ENVIRONMENT = 'development';

if (APP_ENVIRONMENT === 'local') {
    BASE_ENDPOINT = 'http://localhost:5000';
} else if (APP_ENVIRONMENT === 'development') {
    BASE_ENDPOINT = 'https://ineedsomething.herokuapp.com';
} else if (APP_ENVIRONMENT === 'staging') {
    BASE_ENDPOINT = 'https://ineedsomething.herokuapp.com';
} else if (APP_ENVIRONMENT === 'production') {
    BASE_ENDPOINT = 'https://ineedsomething.herokuapp.com';
}

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;
//console.log(BASE_ENDPOINT)

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    withCredentials: true
});
