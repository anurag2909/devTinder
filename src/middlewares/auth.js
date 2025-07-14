const checkAuth = (req, res, next) => {
    const token = 'xyz';
    const isAuthenticated = token === 'xyz';

    console.log("Inside the Authentication");

    if (!isAuthenticated) {
        console.log("Not Authenticated");
        res.status(401).send("Unauthorized user");
    } else {
        console.log("Authenticated");
        next();
    }
};

module.exports = {
    checkAuth,
}