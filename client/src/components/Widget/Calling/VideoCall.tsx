import { setOpenStream } from '@/redux/features/streamSlice'
import { NextPage } from 'next'
import React, { memo, useEffect, useRef, useState } from 'react'
import { AiFillMessage, AiOutlineCamera, AiOutlineCloseCircle } from 'react-icons/ai'
import { BsCameraVideo, BsMic } from 'react-icons/bs'
import { GiPhone } from 'react-icons/gi'
import { MdOutlineMessage, MdOutlineZoomOutMap } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import Peer from 'peerjs';
import { RootState } from '@/redux/store'
import { useSession } from 'next-auth/react'
import io, { Socket } from 'socket.io-client'
import { toast } from 'react-hot-toast'


const VideoCall: NextPage= () => {
    const dispatch = useDispatch()
    const [zoomIn, setZoomIn] = useState(false)

    // useEffect(() => {
    //     const peer = new Peer(session?.user?.id as string)
    //     setPeer(peer)
    //      peer.on("call" , (call: any) => {
    //          navigator.mediaDevices.getUserMedia({audio: true, video: true})
    //          .then(stream => {
    //             call.answer(stream)
    //             call.on('stream', (remoteStream: any) => {
    //                 remoteStreamRef.current.srcObject = remoteStream
    //             })
    //          }).catch(err => {
    //             toast.error(err.message)
    //          })
    //        }) 
         
        

    //     socket.on("acceptCall", ({peerId}) => {
    //         setIsAcceptCall(true)
    //         const call = peer.call(peerId, stream);
    //         call.on('stream', (remoteStream: any) => {
    //           remoteStreamRef.current.srcObject = remoteStream
    //         });
    //         console.log("acceptCall", );
    //         console.log("peerId", peerId );
    //     })

    //     socket.on("rejectCall" , () => {
    //         setIsRejectCall(true)
    //         console.log("rejectCall");
    //     })
    // },[])


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