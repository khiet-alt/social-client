import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { ApolloError, useMutation } from '@apollo/client';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY, CREATE_POST_MUTATION } from '../util/graphql';

import { AuthContext } from '../context/auth'

function PostForm() {
  const { user } = React.useContext(AuthContext);
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(cache, result) {
      let data: any = cache.readQuery({
        query: FETCH_POSTS_QUERY
      });
      const temp = {
        getPosts: [result.data.createPost, ...data.getPosts]
      }
      cache.writeQuery({ query: FETCH_POSTS_QUERY, data: temp });
      values.body = '';
    },
    onError(err: ApolloError){}
  })

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder={user ? `How are u today, ${user.username} !` : `What's up bro ???`}
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
            style={{minHeight: "50px"}}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default PostForm;
