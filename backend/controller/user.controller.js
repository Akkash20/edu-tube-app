const { registerUser, loginUser } = require("../service/user.service");

const registeruser = async (req, res) => {

    const { name, emailId, password } = req.body;

    try {
        const user = await registerUser({ name, emailId, password });
        res.status(200).json(
            {
                success: true,
                message: "user registered sucessfully",
                data: {
                    name: user.name,
                    email: user.emailId
                }
            }
        );
    }
    catch (error) {
        const statusCode = error.statuscode || 500;
        console.log("error", error);
        res.status(statusCode).json({ success: false, message: error.message });
    }


}

const loginUserController = async (req, res) => {

    const { emailId, password } = req.body;

    try {
        const user = await loginUser({ emailId, password });
        res.status(200).json({ success: true, token: user.token, message: "login sucessfully completed" });
    }
    catch (error) {
        console.log("error ", error.message);
        res.status(500).json({ success: false, message: "login failed" });
    }
}

module.exports = { registeruser, loginUserController };