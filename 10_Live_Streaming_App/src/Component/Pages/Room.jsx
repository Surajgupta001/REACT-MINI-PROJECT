import React from 'react'
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function Room() {

    let { roomId } = useParams(); // useParams is a hook that returns an object of key/value pairs of the dynamic params from the current URL

    function randomID(len) {
        let result = '';
        if (result) return result;
        var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
            maxPos = chars.length,
            i;
        len = len || 5;
        for (i = 0; i < len; i++) {
            result += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return result;
    }
 
    const appID = Number(import.meta.env.VITE_APP_ID);
    const serverSecret = import.meta.env.VITE_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, randomID(5), randomID(5));
 
    // Define the role for the user, e.g., "Host" or "Audience"
    const role = ZegoUIKitPrebuilt.Host; // or ZegoUIKitPrebuilt.Audience based on your logic

    let myMeeting = async (element) => {
        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.LiveStreaming,
                config: {
                    role,
                },
            },
            sharedLinks: [
                {
                    name: 'Copy Link',
                    url: `https://localhost:5173/room/${roomId}`,
                },
            ]
        });
    };

    return (
        <div
            className="myCallContainer"
            ref={myMeeting}
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    )
}

export default Room