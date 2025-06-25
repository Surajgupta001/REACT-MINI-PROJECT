import React, { useEffect, useRef } from 'react'
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function App() {
  const zpRef = useRef(null);
  const userID = "Suraj" + Math.floor(Math.random() * 10000);
  const userName = "user_" + userID;
  const appID = parseInt(import.meta.env.VITE_APP_ID, 10);
  const serverSecret = import.meta.env.VITE_SERVER_SECRET;
  const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    null,
    userID,
    userName
  );

  useEffect(() => {
    const zp = ZegoUIKitPrebuilt.create(TOKEN);
    zpRef.current = zp;
    zp.addPlugins({ ZIM });
  }, [TOKEN]);

  function invite(callType) {
    const targetUser = {
      userID: prompt("Enter the user ID to invite:"),
      userName: prompt("Enter the user name to invite:")
    };
    zpRef.current.sendCallInvitation({
      callees: [targetUser],
      callType,
      timeout: 60,
    }).then((res) => {
      console.warn(res);
    })
      .catch((err) => {
        console.warn(err);
      });
  }


  return (
    <>
      <div className='w-full h-screen bg-gradient-to-b from-[#1a2229] to-black flex items-center justify-center'>
        <div className='w-[500px] h-[400px] bg-[#0d1014] border-2 border-[#313030] rounded-lg flex flex-col items-center justify-center gap-4 p-4'>
          <h2 className='text-xl font-semibold text-white'><span className='text-[#4fd1c5]'>UserName : </span>{userName}</h2>
          <h2 className='text-xl font-semibold text-white'><span className='text-[#4fd1c5]'>UserID : </span>{userID}</h2>
          <button className='mt-6 px-6 py-2 bg-[#4fd1c5] text-[#0d1014] font-bold rounded-lg hover:bg-[#38b2ac] transition cursor-pointer' onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)}>Voice Call</button>
          <button className='mt-6 px-6 py-2 bg-[#4fd1c5] text-[#0d1014] font-bold rounded-lg hover:bg-[#38b2ac] transition cursor-pointer' onClick={() => invite(ZegoUIKitPrebuilt.InvitationTypeVideoCall)}>Video Call</button>
        </div>
      </div>
    </>
  )
}

export default App;
