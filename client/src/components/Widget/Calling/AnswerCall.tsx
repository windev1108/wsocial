import { RootState } from '@/redux/store'
import Image from 'next/image'
import React from 'react'
import { toast } from 'react-hot-toast'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'

const AnswerCall = () => {
    const { answer } : any = useSelector<RootState>(state => state.stream)
    const { socket } : any = useSelector<RootState>(state => state.socket)



    // const acceptCall = () => {
    //     try {
    //              socket?.emit("callAccepted", { peerId: 123 , callerId: answer?.caller?.id })
            
    //     } catch (error: any) {
    //       toast.error(error.message)
    //     }
    //   }
      
      
    //   const rejectCall = () => {
    //       try {
    //          socket?.emit("rejectCall", { callerId: answer?.caller?.id})
    //     } catch (error: any) {
    //       toast.error(error.message)
    //       }
    //   }


  return (
    <div className="w-72 h-72 rounded-lg top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed border-[1px] shadow-md bg-light">
    <div className="p-4 flex-col space-y-3">
    <div className="flex justify-center items-center">
          <Image className="rounded-full" src={answer.caller.image} alt="" width={100} height={100} />
            </div>
           <p className="font-semibold text-center">{`${answer.caller.name} calling for you`}</p>
           <p className="text-sm text-gray-500">This call would start when you press accept </p>
         <div className="flex space-x-3 justify-center">
            {/* <button 
            onClick={rejectCall}
            className="hover:bg-opacity-70 bg-red-500 rounded-full text-light p-3">
               <IoMdClose />
            </button>

            <button
            onClick={acceptCall}
            className="hover:bg-opacity-70 bg-green-500 rounded-full text-light p-3">
               <BsFillCameraVideoFill />
            </button> */}
       </div>
             </div>
   </div>
  )
}

export default AnswerCall