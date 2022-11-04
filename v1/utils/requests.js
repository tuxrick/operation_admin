module.exports = {
    error_response: function(req, res, data, message){
        res.status(401).json({ 
            data: data,
            message:message,
            status: "error"
        });        
    },
    success_response: function(req, res, data, message){
        res.status(200).json({ 
            data: data,
            message:message,
            status: "success"
        });        
    }
}