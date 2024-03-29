import bcrypt from "bcrypt";
import { addPreference, addUser, getAllUsersInRoom, getPreference, getSettings, 
        getUserByUsername, getUserInRoom, mergeUsers, setUserIn, setUserOut, updateRoomSettings } from "../models/user.js";


export const userRegisterController = async (traineeDetails) => {

    traineeDetails.password = await bcrypt.hash(traineeDetails.password, 10);
    const userExists = await getUserByUsername(traineeDetails.email)
    if (userExists) {
        return 0
    }
    const success = addUser(traineeDetails)
    if (success)
        return true;
    return 0;
}

export const loginController = async (loginDetails) => {
    const trainee = await getUserByUsername(loginDetails.username);
    const username = loginDetails.username;
    if (loginDetails && trainee && (await bcrypt.compare(loginDetails.password, trainee.password))) {
        const token = jwt.sign(
            { username, userId: trainee.id, firstName: trainee.first_name, lastName: trainee.last_name, userType: "trainee" },
            env.authTokenKey,
            { expiresIn: env.authTokenExpiry }
        );
        const response = {
            token: `Bearer ${token}`, username, name: trainee.first_name,
        }
        return response;
    }
    return false;
}



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
        //const {room_id, light_color, light_intensity, fan_speed, room_temp}=getPrefer[0]

        if (getPrefer) {
            await setUserIn(user)
            const update = await updateRoomSettings(getPrefer[0])
            if (update)
                return 1
        }
    }
    return 0
}