export const createWorkspaceMember = async (body) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/members`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return await response.json();
};



export const readWorkspaceMember = async (query) => {
    const response = query.id ? await fetch(`${process.env.REACT_APP_API_URL}workspaces/members/` + query.id, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }) : await fetch(`${process.env.REACT_APP_API_URL}workspaces/members?` + new URLSearchParams(query), {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};
export const updateWorkspaceMember = async (id, body) => { // attrib des roles (action critique donc je vérif avec le token)
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.Token;


  const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/members/${id}`, {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};


export const deleteWorkspaceMember = async (id) => {  // kick (action critique donc je vérif avec le token)
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.Token;

    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/members/${id}`, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    return await response.json();
};


export const restoreWorkspaceMember = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}workspaces/members/` + id, {
        method: "PATCH",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    return await response.json();
};


