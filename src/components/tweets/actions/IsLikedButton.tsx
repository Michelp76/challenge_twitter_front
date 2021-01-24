import { useMutation } from '@apollo/client'
import React from 'react'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { useRecoilState, useRecoilValue } from 'recoil'
import { TOGGLE_LIKE } from '../../../graphql/tweets/mutations'
import { isLikedState } from '../../../state/tweetsState'
import Button from '../../Button'

type IsLIkedButtonProps = {
  id: number
}

const IsLikedButton = ({ id }: IsLIkedButtonProps) => {
  const [isLiked, setIsLiked] = useRecoilState(isLikedState(id))

  const [toggleLike, { error }] = useMutation(TOGGLE_LIKE, {
    variables: {
      tweet_id: id,
    },
    update(cache, { data: { toggleLike } }) {
      setIsLiked(toggleLike.includes('added'))
    },
  })
  return (
    <Button
      text={`${isLiked ? 'Liked' : 'Likes'}`}
      variant={`${isLiked ? 'active' : 'default'}`}
      className={`text-lg md:text-sm`}
      onClick={() => toggleLike()}
      icon={isLiked ? <MdFavorite /> : <MdFavoriteBorder />}
      alignment="left"
      hideTextOnMobile={true}
    />
  )
}

export default IsLikedButton