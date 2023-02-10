import React from 'react'
import SuggestUsersComponent from './SuggestUsersComponent'


const SuggestUsers = () => {

    return (
        <div className="bg-light h-[40vh] shadow-lg rounded-xl">
            <div className="border-gray-200 text-dark border-gray-600flex px-4 py-2 border-b-[1px] flex justify-between">
                <span className="flex-1 font-semibold text-sm">
                    People you may know
                </span>
                <span className="cursor-pointer text-primary text-sm">See all</span>
            </div>
            <div className="scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-[90%]  space-y-2 scrollbar-thin  overflow-scroll overflow-x-hidden">
                <SuggestUsersComponent
                    name="Erling Halland"
                    location="Da Nang, Viet Nam"
                    facebookUrl="https://www.facebook.com/"
                    instagramUrl="https://www.instagram.com/"
                    twitterUrl="https://twitter.com/"
                    linkedinUrl="https://linkedin.com/"
                />
                <SuggestUsersComponent
                    name="Erling Halland"
                    location="Da Nang, Viet Nam"
                    facebookUrl="https://www.facebook.com/"
                    instagramUrl="https://www.instagram.com/"
                    twitterUrl="https://twitter.com/"
                    linkedinUrl="https://linkedin.com/"
                />
                <SuggestUsersComponent
                    name="Erling Halland"
                    location="Da Nang, Viet Nam"
                    facebookUrl="https://www.facebook.com/"
                    instagramUrl="https://www.instagram.com/"
                    twitterUrl="https://twitter.com/"
                    linkedinUrl="https://linkedin.com/"
                />
            </div>
        </div>
    )
}

export default SuggestUsers