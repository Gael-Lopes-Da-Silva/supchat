import axios from "axios";

export const loginUser = async (email, password) => {
    return await axios({
        method: "GET",
        url: "http://localhost:3000/users/login",
        data: {
            email: email,
            password: password,
        }
    });;
};