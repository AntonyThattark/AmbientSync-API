
import { addPreference, getAllUsersInRoom, getPreference, getSettings, 
         getUserInRoom, mergeUsers, setUserIn, setUserOut, updateRoomSettings } from "../models/preference.js";






export const userPreferenceController = async (userId) => {

    const prefer = await addPreference(userId.userId)
    //console.log(prefer)
    if (prefer)
        return prefer
    return 0
}



export const getRoomSettingsController = async (room) => {
    //const occupants = await getOccupantsOfRoom(room)
    let settings = await getSettings(room)

    return settings
}



export const updateSettingsController = async (user) => {

    const userInRoom = await getUserInRoom(user)
    const otherUsersInRoom = await getAllUsersInRoom(user)

    if (userInRoom) {
        await setUserOut(user)
        const userLeft = await mergeUsers(user)
        if (userLeft) {
            const id = user.id
            user.id = userLeft
            const getPrefer = await getPreference(user)
            if (getPrefer) {
                const update = await updateRoomSettings(getPrefer[0])
                if (update) {
                    user.id = id
                    return 1
                }
            }
            return 0
        }
        else {
            const update = await updateRoomSettings(user)
            if (update) {
                await setUserOut(user)
                return 1
            }
            return 0
        }
    }

    else if (otherUsersInRoom) {
        await setUserIn(user)
        const check=await mergeUsers(user)
        if(check){
            const id = user.id
            user.id = check
            const getPrefer = await getPreference(user)
            if (getPrefer) {
                user.id = id
                const update = await updateRoomSettings(getPrefer[0])
                if (update)
                    return 1
            }
        }
        return 0
    }

    else {
        const getPrefer = await getPreference(user)

        if (getPrefer) {
            await setUserIn(user)
            const update = await updateRoomSettings(getPrefer[0])
            if (update)
                return 1
        }
    }
    return 0
}