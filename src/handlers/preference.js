import {
    checkUserPrimaryController,
    getPreferenceController,
    getRoomDetailsController, getRoomSettingsController, updateSettingsController,
    userPreferenceController
} from "../controllers/preference.js";




export const getRoomSettingsHandler = async (req, res) => {
    try {
        const response = await getRoomSettingsController(req.params.room_id)
        res.status(200).send(response)
    } catch (exception) {
        console.log("Unexpected error occured ", exception)
        res.status(500).send({
            errorMessage: "Unexpected error occured. Check server logs"
        })
    }
}


export const updateSettingsHandler = async (req, res) => {
    try {
        const body = { room_id: req.params.room_id, id: req.params.user_id }
        // console.log(body)
        const update = await updateSettingsController(body)
        if (update) {
            res.status(200).json("Update successfull")
            return;
        }
        res.status(500).json({ Message: "Nothing Found" })
    }
    catch (error) {
        console.log("An unexpected error occured while scanning user ", error.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}



export const userPreferenceHandler = async (req, res) => {
    try {
        if(!req.body.id)
            req.body.id= req.user.userId;
        const prefer = await userPreferenceController(req.body)
        if (prefer) {
            res.status(200).json("User preference added successfully")
            return;
        }
        res.status(500).json({ Message: "Nothing Found" })
    }
    catch (error) {
        console.log("An unexpected error occured while fetching ", error.message)
        res.status(500).json({ errorMessage: 'An unexpected error occured. Check server logs' });
    }
}




export const getRoomDetailsHandler = async (req, res) => {
    try {
        const response = await getRoomDetailsController(req.user.userId)
        res.status(200).send(response)
    } catch (exception) {
        console.log("Unexpected error occured while fetching room details", exception)
        res.status(500).send({
            errorMessage: "Unexpected error occured while fetching room details. Check server logs"
        })
    }
}


export const checkUserPrimaryHandler = async (req, res) => {
    try {
        req.user.roomId= req.params.roomId;
        const response = await checkUserPrimaryController(req.user)
        res.status(200).send(response)
    } catch (exception) {
        console.log("Unexpected error occured while checking primary user", exception)
        res.status(500).send({
            errorMessage: "Unexpected error occured while checking primary user. Check server logs"
        })
    }
}

export const getPreferenceHandler = async (req, res) => {
    try {
        const user= {id: req.params.users_id, room_id: req.params.room_id}
        const response = await getPreferenceController(user)
        res.status(200).send(response)
    } catch (exception) {
        console.log("Unexpected error occured while fetching preference", exception)
        res.status(500).send({
            errorMessage: "Unexpected error occured while fetching preference. Check server logs"
        })
    }
}