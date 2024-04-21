import mqtt from "mqtt"


let client

export const createConnection = () => {
    client = mqtt.connect("mqtt://192.168.154.71:1883")
    // client.on("connect", () => {
    //     client.subscribe("presence", (err) => {
    //         if (!err) {
    //           client.publish("presence", "Hello mqtt");
    //         }
    //       });
    //     client.on("message", (topic, message) => {
    //     // message is Buffer
    //     console.log("conn: ", message.toString());
    //     client.end();
    //     });
    //   });
}

export const getConnection = () => {
    return client
}

