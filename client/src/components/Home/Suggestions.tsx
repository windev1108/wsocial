import React from 'react'
import SuggestUser from './SuggestAddFriend'
import SuggestUserBirthday from './SuggestUserBirthday'


const Activity = () => {

    return (
        <div className="col-span-2 space-y-5">
            <SuggestUser />
            <SuggestUserBirthday />
        </div>
    )
}

export default Activity