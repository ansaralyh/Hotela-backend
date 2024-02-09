const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    // console.log(token);

    /**Options for cookie */
    const expiresDate = new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000);

    const options = {
        expiresIn: expiresDate, 
        httpOnly: true
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;



