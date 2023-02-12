import { setOpenStream } from '@/redux/features/streamSlice'
import { NextPage } from 'next'
import React, { memo, useEffect, useRef, useState } from 'react'
import { AiFillMessage, AiOutlineCamera, AiOutlineCloseCircle } from 'react-icons/ai'
import { BsCameraVideo, BsFillCameraVideoFill, BsMic } from 'react-icons/bs'
import { GiPhone } from 'react-icons/gi'
import { MdOutlineMessage, MdOutlineZoomOutMap } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import AgoraRTC  from "agora-rtc-sdk"

const VideoCall: NextPage= () => {
    const dispatch = useDispatch()
    const [zoomIn, setZoomIn] = useState(false)
    const [client, setClient] = useState<AgoraRTC.Client | null>(null);
    const [localStream, setLocalStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<any>(null);

    useEffect(() => {
        // Initialize the Agora SDK
        const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        client.init(process.env.NEXT_PUBLIC_AGORA_APP_ID as string, () => {
          console.log("AgoraRTC client initialized");
          setClient(client);
        }, error => {
          console.error(error);
        });
    
        return () => {
          client.leave();
        };
      }, []);
    
      const join = () => {
        // Join a channel
        client?.join("YOUR_CHANNEL_NAME", "YOUR_TOKEN", null);
      };
    
      const leave = () => {
        // Leave the channel
        client?.leave(() => {
          console.log("AgoraRTC client leave channel");
        }, (error : any) => {
          console.error("AgoraRTC client leave channel error: " + error);
        });
      };

    //   const start = () => {
    //     // Create a local stream
    //     const localStream = AgoraRTC.createStream({
    //       streamID: client?.getId() as string,
    //       audio: true,
    //       video: true,
    //       screen: false
    //     });
    
    //     // Initialize the local stream
    //     localStream.init(() => {
    //       console.log("getUserMedia successfully");
    //       setLocalStream(localStream);
    //       // Subscribe the local stream
    //       client?.subscribe(localStream);
    //     // Publish the local stream
    //     client?.publish(localStream, (error: any) => {
    //     console.log("Publish local stream error: " + error);
    //     });
    //     // Play the local stream
    //     localStream.play("local");
    //     }, error => {
    //     console.error("getUserMedia failed: " + error);
    //     });
    //     };
        
        const stop = () => {
        // Stop the local stream
        localStream.stop();
        // Close the local stream
        localStream.close();
        setLocalStream(null);
        };


    return (
            <div className={`${zoomIn ? "z-[20000] top-0 left-0 right-0 bottom-0 rounded-none" : "z-[20000] rounded-lg top-20  left-52 right-52 bottom-20"} fixed transition-all duration-500 ease-in-out border-[1px] border-gray-400 bg-light`}>
                <div className="flex justify-between px-4 py-1 items-center shadow-md">
                    <div className="flex space-x-2 items-center">
                        <AiFillMessage className="text-2xl text-primary" />
                        <span className="font-semibold">Win Meet</span>
                    </div>
                    <div className="flex space-x-2 items-center">
                        <div
                            onClick={() => setZoomIn(!zoomIn)}
                            className="group cursor-pointer hover:bg-gray-200 text-dark text-lg rounded-full p-2">
                            <MdOutlineZoomOutMap className="group-hover:scale-110 transition-all duration-500" />
                        </div>
                        <div
                            onClick={() => dispatch(setOpenStream({
                                isOpen: false,
                                peerId: null
                            }))}
                            className="cursor-pointer hover:bg-gray-200 text-dark text-xl rounded-full p-2">
                            <AiOutlineCloseCircle />
                        </div>
                    </div>
                </div>
                <div className="relative w-full h-full flex space-x-1">
                 <div className="relative flex space-x-1 w-full">
                     <div className="w-1/2 bg-black"></div>
                     <div className="w-1/2 bg-secondary"></div>
                 </div>

                </div>
                <div className="absolute bottom-3 left-[50%] translate-x-[-50%]">
                    <div className="flex space-x-8 items-center">
                        <div className="cursor-pointer hover:bg-[#777] flex items-center justify-center p-4 rounded-full text-light w-14 h-14 text-3xl bg-[#999] ">
                            <AiOutlineCamera />
                        </div>
                        <div className="cursor-pointer hover:bg-[#777] flex items-center justify-center p-4 rounded-full text-light w-14 h-14 text-3xl bg-[#999] ">
                            <BsMic />
                        </div>
                        <div className="cursor-pointer hover:bg-opacity-80 flex items-center justify-center p-4 w-20 h-20 rounded-2xl text-light text-3xl bg-[#ff5630]">
                            <GiPhone />
                        </div>
                        <div className="cursor-pointer hover:bg-[#777] flex items-center justify-center p-4 rounded-full text-light w-14 h-14 text-3xl bg-[#999] ">
                            <BsCameraVideo />
                        </div>
                        <div className="cursor-pointer hover:bg-[#777] flex items-center justify-center p-4 rounded-full text-light w-14 h-14 text-3xl bg-[#999] ">
                            <MdOutlineMessage />
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default memo(VideoCall)