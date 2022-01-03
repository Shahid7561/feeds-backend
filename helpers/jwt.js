const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/api\/v1\/posts(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/comment(.*)/ , methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/posts/create`,
            `${api}/comment/create`,
            `${api}/comment`,
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        done(null, true)
    }

    done();
}



module.exports = authJwt