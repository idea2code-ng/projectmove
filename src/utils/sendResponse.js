// Send create new entry response (request , response , data that you want to pass)
const createResponse = (req, res, data) => {
       res.status(200);
       res.json({isSuccess: true, status: 1, info: data});
}
const SignupResponse = (req, res, res_data, loginjwt_signup, data) => {
       res.status(200);
       res.json({isSuccess: true, status: 1, message: data, token: loginjwt_signup, info: res_data});
}
const LoginResponse = (req, res, res_data, loginjwt_signup, data) => {
       res.status(200);
       res.json({isSuccess: true, status: 1, message: data, token: loginjwt_signup, info: res_data});
}

// Send success response (request , response , data that you want to pass)
const successResponce = (req, res, data) => {
       res.status(200);
       res.json({isSuccess: true, status: 1, info: data});
}

// Delete response (reqeust , response and message that want to dispay)
const deleteResponce = (req, res, data) => {
       res.status(202);
       res.json({isSuccess: true, status: 1, message: data});
}

// Delete response (reqeust , response , status  and message that want to dispay)
const queryErrorRelatedResponse = (req, res, status, data) => {
       res.status(status || 400)
       res.json({isSuccess: false, status, message: data});
}

// Send success response of avatar(Image) (request , response , message and baseURL)
const successResponceOfAvatar = (req, res, message, baseurl) => {
       res.status(200);
       res.json({isSuccess: true, status: 200, message, baseurl});
}

module.exports = {
       createResponse, successResponce, deleteResponce,
       queryErrorRelatedResponse, successResponceOfAvatar, SignupResponse, LoginResponse}