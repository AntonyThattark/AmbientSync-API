import { loginController, updateSettingsController, userPreferenceController, userRegisterController } from "../controllers/user.js";



export const userRegisterHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!(name && password && email)) {
            res.status(400).json({ errorMessage: "All input is required" });
            return;
        }

        const register = await userRegisterController(req.body);
        if (register) {
            res.status(200).json({ successMessage: "OTP was successfully send" })
            return;
        }
        res.status(500).json({ Message: "Username already taken" })
    }
    catch (error) {
        console.log("An unexpected error occured while registering user ", error.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }

}

export const userLoginHandler = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).json("All input is required");
            return;
        }
        const success = await loginController(req.body);
        if (success) {
            res.status(200).json(success)
            return success;
        }
        res.status(401).json({ Message: "Login Failed" })
    }
    catch (e) {
        console.log("An unexpected error occured while login ", e.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }

}



export const userPreferenceHandler = async (req,res)=>{
    try{
        const prefer=await userPreferenceController(req.body)
        if(prefer){
            res.status(200).json(prefer)
            return;
        }
        res.status(500).json({ Message: "Nothing Found" })
    }
    catch (error) {
        console.log("An unexpected error occured while fetching ", error.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}


export const updateSettingsHandler = async (req,res)=>{
    try{
        
        const update=await updateSettingsController(req.body)
        if(update){
            res.status(200).json("Update successfull")
            return;
        }
        res.status(500).json({ Message: "Nothing Found" })
    }
    catch (error) {
        console.log("An unexpected error occured while fetching ", error.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}