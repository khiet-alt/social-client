import React from 'react'
import { useMutation } from '@apollo/client'
import { Button, Icon, Confirm } from 'semantic-ui-react'

import  { DELETE_POST_MUTATION, DELETE_COMMENT_MUTATION, FETCH_POSTS_QUERY } from '../util/graphql'

import MyPopup from '../util/MyPopup'

type Prop = {
    postId: string;
    callback?: () => void
    commentId?: null | string
}

export default function DeleteButton({ postId, callback, commentId = null }: Prop ) {
    const [ confirmOpen, setConfirmOpen ] = React.useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [ deleteMutation ] = useMutation(mutation, {
        update(cache) {
            setConfirmOpen(false)
            // TODO: remove post or cmt from the cache
            if (!commentId){    // this will be called when delete post else delete comment
                let data: any = cache.readQuery({
                    query: FETCH_POSTS_QUERY
                })
                const temp = {
                    getPosts: data.getPosts.filter((item: any) => item.id !== postId)
                }
                cache.writeQuery({ query: FETCH_POSTS_QUERY, data: temp})
            }

            if (callback) callback()    // this will be redirect to homepage
        },
        variables: {
            postId,
            commentId
        },
    })

    return (
        <>
            <MyPopup content={commentId ? "Delete comment" : "Delete post"} >
                <Button as="div" color="red" floated="right"
                    onClick={() => setConfirmOpen(true)} >
                    <Icon name="trash" style={{margin: 0}} />
                </Button>
            </MyPopup>
            
            <Confirm open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => deleteMutation()}
            />
        </>
    )
}
