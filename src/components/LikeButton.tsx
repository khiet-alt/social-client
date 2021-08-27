import React from 'react'
import { useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'
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
    
    const CheckLiked = (props: any) => {
        if (user){
            return (
                liked ? (
                    <Button color='white' {...props} style={{background: "white"}} >
                        <Icon name='heart' color="red" />liked
                    </Button>
                ) : (
                    <Button color='teal' {...props} style={{background: "white", color: "#737981"}}  >
                        <Icon name='heart' style={{color: "#737981"}} />like
                    </Button>
                )
            )
        }

        return (
            <Button as={Link} to="/login" {...props} style={{background: "white", color: "#737981"}} >
                <Icon name='heart' style={{color: "#737981"}} />like
            </Button>
        )
    }

    return (
          <MyPopup content={liked ? 'Unlike' : 'Like'}>
              <CheckLiked onClick={() => likePost()}/>
          </MyPopup>
    )
}
