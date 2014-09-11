/*jslint node:true */
'use strict';

var users = require('./controller/users');

module.exports = function(express) {
    var router = express.Router();

    router.get('/users', users.list);
    router.post('/users', users.create);
    router.get('/users/:userId', users.read);
    router.put('/users/:userId', users.update);
    router.delete('/users/:userId', users.delete);

    return router;
};
