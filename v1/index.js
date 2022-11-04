module.exports = function(app, router, route){
    
    let users = require('./routes/users.js');
    app.use(route+'/user', users(router));
    
    return app;
}