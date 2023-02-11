import { setOpenStream } from '@/redux/features/streamSlice'
import { NextPage } from 'next'
import React, { memo, useEffect, useRef, useState } from 'react'
import { AiFillMessage, AiOutlineCamera, AiOutlineCloseCircle } from 'react-icons/ai'
import { BsCameraVideo, BsFillCameraVideoFill, BsMic } from 'react-icons/bs'
import { GiPhone } from 'react-icons/gi'
import { MdOutlineMessage, MdOutlineZoomOutMap } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Peer } from 'peerjs';
import { RootState } from '@/redux/store'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { IoMdClose } from 'react-icons/io'


const VideoCall: NextPage= () => {
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const [zoomIn, setZoomIn] = useState(false)
    const { socket } : any = useSelector<RootState>(state => state.socket)
    const { users } : any = useSelector<RootState>(state => state.session)
    const { stream : streamSelector} : any = useSelector<RootState>(state => state.stream)
    const [ isCallAccepted , setIsCallAccepted ] = useState(false)
    const [ peerId , setPeerId ] = useState<string | null>(null)
    const [ peer,setPeer ] = useState<any>(null)
    const localStreamRef = useRef<any>()
    const remoteStreamRef = useRef<any>()


    useEffect(() => {
              navigator.mediaDevices.getUserMedia({audio: true , video: true})
              .then(stream => {
                const peer = new Peer()
                peer.on("open" , (id) => {
                    setPeerId(id)
                    setPeer(peer)
                    peer.on("call", (call) => {
                        call.answer(stream)
                        call.on("stream" ,  (remoteStream) => {
                           console.log("remoteStream" ,remoteStream );
                           remoteStreamRef.current = remoteStream
                           localStreamRef.current = stream
                        })
                   })
                })
                
                socket.on("callAccepted", ({ peerId } : { peerId: string}) => {
                    console.log("callAccepted with peerId",  peerId);
                    const call = peer?.call(peerId, stream)
                    call.on("stream" , (remoteStream) => {
                        console.log("remoteStream" ,remoteStream );
                        remoteStreamRef.current = remoteStream
                        localStreamRef.current = stream
                    })
                    setIsCallAccepted(true)
                })

              }).catch(err => {
                toast.error(err.message)
              })
    },[])

    console.log("peer",peer);
    console.log("peerId",peerId);
    console.log("remoteStreamRef",remoteStreamRef);
    console.log("localStreamRef",localStreamRef);


    const acceptCall = () => {
        try {
              if(peerId){
                 socket?.emit("callAccepted", { peerId , callerId: streamSelector?.caller?.id })
                 setIsCallAccepted(true)
              }else{
                toast.error("Please try again")
              }
        } catch (error: any) {
          toast.error(error.message)
        }
      }
      
      
      const rejectCall = () => {
          try {
             socket?.emit("rejectCall", { callerId: streamSelector?.caller?.id})
        } catch (error: any) {
          toast.error(error.message)
            
          }
      }

 

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
                    
                 {!isCallAccepted && streamSelector?.caller.id !== session?.user?.id &&
                    <div className="w-72 h-72 rounded-lg top-[50%]  left-[50%] translate-x-[-50%] translate-y-[-50%] fixed border-[1px] shadow-md bg-light">
                     <div className="p-4 flex-col space-y-3">
                     <div className="flex justify-center items-center">
                           <Image className="rounded-full" src={streamSelector.caller.image} alt="" width={100} height={100} />
                             </div>
                            <p className="font-semibold text-center">{`${streamSelector.caller.name} calling for you`}</p>
                            <p className="text-sm text-gray-500">This call would start when you press accept </p>
                          <div className="flex space-x-3 justify-center">
                             <button 
                             onClick={rejectCall}
                             className="hover:bg-opacity-70 bg-red-500 rounded-full text-light p-3">
                                <IoMdClose />
                             </button>
            
                             <button
                             onClick={acceptCall}
                             className="hover:bg-opacity-70 bg-green-500 rounded-full text-light p-3">
                                <BsFillCameraVideoFill />
                             </button>
                        </div>
                              </div>
                    </div>
                 }

                 <div className="relative flex space-x-1 w-full">
                     <div className="w-1/2 bg-black"></div>
                     <div className="w-1/2 bg-secondary"></div>
                 </div>

                </div>
                {isCallAccepted &&
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
                    
                }
            </div>
    )
}

export default memo(VideoCall)