import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Grid, Image, Card, Button, Icon, Label, Form } from 'semantic-ui-react'
import moment from 'moment'

import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'
import MyPopup from '../util/MyPopup'

//gql
import { FETCH_POST_QUERY, SUBMIT_COMMENT_MUTATION } from '../util/graphql'

import { AuthContext } from '../context/auth'

export default function SinglePost(props: any) {
    const postId = props.match.params.postId
    const { user } = React.useContext(AuthContext)
    const [ comment, setComment ] = React.useState('')
    const commentInputRef = React.useRef<HTMLButtonElement| null>(null)
    
    const { loading, data, error } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    })

    const [ submitComment ] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('')
            commentInputRef.current!.blur()
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback(){
        props.history.push('/')
    }
    
    let postMarkup;
    if (loading)    return <p>Loading...</p>
    if (error)      return <p>Error...</p>
    
    if (!data)   postMarkup = <p>Loading post</p>
    else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image floated="right" size="small" avatar src="https://react.semantic-ui.com/images/avatar/large/molly.png" />
                    </Grid.Column>
                    <Grid.Column width={14}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <Card.Meta style={{display: "flex"}} >
                                    <p style={{marginRight: '10px'}} >{`${likeCount} likes `}</p>
                                    <p>{`${likeCount} comments `}</p>
                                </Card.Meta>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <MyPopup content="Comment on Post">
                                    <Button style={{background: "white"}} >
                                        <Icon name='comments' style={{color: "#387b67"}} />comments
                                    </Button>
                                </MyPopup>
                                { user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        { user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input type="text" placeholder="Write comment..." name="comment"
                                                value={comment} onChange={(e) => setComment(e.target.value)} />
                                            <button type="submit" className="ui button teal"
                                                disabled={comment.trim() === ''} 
                                                onClick={() => submitComment()}
                                                ref={commentInputRef}>
                                                    Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        { comments.map((comment: any) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    { user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>
                                        <Image floated="left" size="small" avatar src="https://react.semantic-ui.com/images/avatar/large/molly.png" />
                                        {comment.username}
                                    </Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup
}
