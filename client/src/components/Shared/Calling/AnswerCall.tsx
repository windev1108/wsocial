import { RootState } from '@/redux/store'
import Image from 'next/image'
import React , { useState , useEffect } from 'react'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import io, { Socket } from 'socket.io-client'
import Peer from "peerjs"
import { useSession } from 'next-auth/react'
import { setOpenAnswer, setOpenStream } from '@/redux/features/streamSlice'

const socket: Socket = io(process.env.NEXT_PUBLIC_SERVER || "http://localhost:5000")

const AnswerCall = () => {
  const dispatch = useDispatch()
  const { data: session } = useSession()
  const { answer } : any = useSelector<RootState>(state => state.stream) 


const acceptCall = React.useCallback( () => {
  const peer = new Peer(session?.user?.id as string)
  socket.emit("acceptCall", { peerId: peer.id ,callerId: answer?.caller?.id })
  dispatch(setOpenStream({
    isOpen: true,
    caller: answer.caller
  }))
},[])

const rejectCall = React.useCallback(() => {
  socket.emit("rejectCall", { callerId: answer?.caller?.id})
  dispatch(setOpenAnswer({
    isOpen: false,
    caller: null
  }))
},[])

  return (
    <div className="z-[20000] w-64 h-6w-64 rounded-lg top-[50%]  left-[50%] translate-x-[-50%] translate-y-[-50%] fixed border-[1px] shadow-md bg-light">
         <div className="p-4 flex-col space-y-3">
         <div className="flex justify-center items-center">
            <Image className="rounded-full" src={answer.caller.image} alt="" width={100} height={100} />
         </div>
            <p className="font-semibold text-center">{`${answer.caller.name} calling for you`}</p>
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
            <button 
            onClick={rejectCall}
            className="absolute top-2 right-2 hover:bg-opacity-70 bg-gray-200 rounded-full text-dark p-2">
                <IoMdClose />
            </button>
    </div>
  )
}

export default AnswerCall