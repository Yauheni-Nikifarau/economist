import {useToast} from "vue-toastification";

const toast = useToast();

const commonHeaders = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('economist_token')
    }
};

const proceedResponse = async (response: any) => {
    const json = await response.json();
    if (response.ok) {
        toast.success(json.message);
        return json;
    } else {
        toast.error(json.message);
        return undefined;
    }
}

const request = async (url: string, body: any, method: string) => {
    return await fetch(url, {
        method: method,
        ...commonHeaders,
        body: JSON.stringify(body),
    });
}

export const ajaxGet = async (url: string) => {
    const response = await fetch(url, {
        ...commonHeaders,
    });
    return await proceedResponse(response);
};

export const ajaxPut = async (url: string, body: any) => {
    const response = await request(url, body, 'PUT');
    return await proceedResponse(response);
};

export const ajaxPost = async (url: string, body: any) => {
    const response = await request(url, body, 'POST');
    return await proceedResponse(response);
};

export const ajaxDelete = async (url: string) => {
    const response = await fetch(url, {
        method: 'DELETE',
        ...commonHeaders,
    });
    return await proceedResponse(response);
};
