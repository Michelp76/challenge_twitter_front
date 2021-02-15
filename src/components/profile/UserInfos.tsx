import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { followersCountState } from '../../state/profileState'
import { followingsState, userState } from '../../state/userState'
import { UserType } from '../../types/types'
import { pluralize } from '../../utils/utils'
import Avatar from '../Avatar'
import FollowButton from '../FollowButton'

type UserInfosProps = {
  user: UserType
}

const UserInfos = ({ user }: UserInfosProps) => {
  const connectedUser = useRecoilValue(userState)
  const [followersCount, setFollowersCount] = useRecoilState(
    followersCountState(user.id)
  )

  useEffect(() => {
    setFollowersCount(user.followersCount!)
  }, [])

  return (
    <div className="relative container max-w-container mx-auto flex flex-col md:flex-row items-center md:items-start p-6 md:p-4 bg-white rounded-lg shadow -mt-8">
      <div className="relative">
        <Avatar
          user={user}
          height="h-28"
          width="w-28"
          className="ring-4 ring-white -mt-20 md:-mt-12"
        />
      </div>
      {/* Name */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full">
        <div className="flex flex-col md:ml-4">
          <div className="flex flex-col md:flex-row md:items-center">
            <h3 className="font-semibold text-xl text-center mt-6 md:mt-0">
              {user.display_name}
            </h3>
            {/* Followers */}
            <div className="flex items-center justify-center mt-6 md:mt-0 md:ml-6">
              <div className="mr-4 text-sm">
                <span className="mr-2 font-semibold">
                  {user.followingsCount}
                </span>
                <span className="text-gray7">
                  {pluralize(user.followingsCount!, 'Following', true)}
                </span>
              </div>
              <div className="text-sm">
                <span className="mr-2 font-semibold">{followersCount}</span>
                <span className="text-gray7">
                  {pluralize(followersCount!, 'Follower', true)}
                </span>
              </div>
            </div>
          </div>
          {/* Bio */}
          <p className="font-noto text-gray7 text-center md:text-left mt-6 md:mt-4">
            {user.bio}
          </p>
        </div>
        {/* FollowButton */}
        {connectedUser!.id !== user.id && (
          <FollowButton user={user} className="mt-6 md:mt-0 self-center" />
        )}
      </div>
    </div>
  )
}

export default UserInfos
