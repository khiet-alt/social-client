import React from 'react'
import { useQuery } from '@apollo/client'
import { Grid, Image, Card, Button, Icon, Label } from 'semantic-ui-react'
import moment from 'moment'

import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'
//gql
import { FETCH_POST_QUERY } from '../util/graphql'

import { AuthContext } from '../context/auth'

export default function SinglePost(props: any) {
    const postId = props.match.params.postId
    const { user } = React.useContext(AuthContext)
    
    const { loading, data, error } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
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
                        <Image floated="right" size="small" src="https://react.semantic-ui.com/images/avatar/large/molly.png" />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <Button as="div" 
                                    labelPosition="right"
                                     >
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                { user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup
}
