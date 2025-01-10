export const createChannelPermission = async(body) => {
    const response = await fetch('http://localhost:3000/channels/permissions', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};

export const readChannelPermission = async (query) => {
    const response = await fetch('http://localhost:3000/channels/permissions?' + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};

export const deleteChannelPermission = async (user_id, channel_id, permission_id) => {
    const response = await fetch('http://localhost:3000/channels/permissions/user/' + user_id + '/channel/' + channel_id + '/permission/' + permission_id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};