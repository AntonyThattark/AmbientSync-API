import {
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
        const update = await updateSettingsController(body)
        if (update) {
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



export const userPreferenceHandler = async (req, res) => {
    try {
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
        const response = await getRoomDetailsController(req.params.id)
        res.status(200).send(response)
    } catch (exception) {
        console.log("Unexpected error occured while fetching room details", exception)
        res.status(500).send({
            errorMessage: "Unexpected error occured while fetching room details. Check server logs"
        })
    }
}