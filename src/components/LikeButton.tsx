import React from 'react'
import { useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Button, Label, Icon } from 'semantic-ui-react'
import MyPopup from '../util/MyPopup'

//gql
import { LIKE_POST_MUTATION } from '../util/graphql'

type Prop = {
    post: {
        id: string;
        likes: Like[];
        likeCount: number;
    };
    user: {
        username: string;
        id: string;
        email: string;
    }
}

export default function LikeButton({post: { id, likes, likeCount }, user}: Prop) {
    const [ liked, setLiked ] = React.useState(false)

    React.useEffect(() => {
        if (user && likes.find(like => like.username === user.username))
            setLiked(true)
        else setLiked(false)
    }, [user, likes])

    const [ likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id},
        onError(err){
            console.log("err: ", err)
        }
    })

    const checkLiked = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        <Button as='div' labelPosition='right' onClick={() => likePost()}>
          <MyPopup content={liked ? 'Unlike' : 'Like'}>
              {checkLiked}
          </MyPopup>
          <Label basic color='teal' pointing='left'>
            {likeCount}
          </Label>
        </Button>
    )
}
