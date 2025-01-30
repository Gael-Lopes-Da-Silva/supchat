import jsonwebtoken from "jsonwebtoken";

export function authentification(request, response, next) {
    let token = "";

    if (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
        token = request.headers.authorization.split(' ')[1];
    } else {
        token = request.headers.authorization;
    }

    if (token == "" || token == null) return response.status(401).json({
        when: "Authentification > CheckToken",
        error: 1,
        error_message: "A token is needed",
    });

    jsonwebtoken.verify(token, process.env.SECRET, (error, user) => {
        if (error) return response.status(401).json({
            when: "Authentification > CheckToken",
            error: 1,
            error_message: error.message,
        });

        request.user = user;
        next();
    });
}