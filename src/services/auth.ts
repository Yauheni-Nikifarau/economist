/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const apiUrl = process.env.VUE_APP_API_URL;

const commonHttpHeaders = {
    method: 'POST',
    headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
    }
}

export const loginByAuth = async (email: string, password: string) => {
    const credentials = JSON.stringify({
        email: email,
        password: password
    });
    const loginUrl = apiUrl + '/login';
    const response = await fetch(loginUrl, {
        ...commonHttpHeaders,
        body: credentials
    });
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    localStorage.setItem('economist_token', json.data.token);
    localStorage.setItem('economist_user', JSON.stringify(json.data.user));
    return json.data.token;
};

export const registerByAuth = async (name: string, email: string, password: string, rePassword: string) => {
    const credentials = JSON.stringify({
        name: name,
        email: email,
        password: password,
        password_confirmation: rePassword
    });
    const registerUrl = apiUrl + '/register';
    const response = await fetch(registerUrl, {
        ...commonHttpHeaders,
        body: credentials
    })
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message);
    }
    localStorage.setItem('economist_token', json.data.token);
    localStorage.setItem('economist_user', JSON.stringify(json.data.user));
    return json.data.token;
};

export const getProfile = async () => {
    const user = JSON.parse(localStorage.getItem('economist_user'));
    return user;
};
