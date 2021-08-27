import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data, error} = useQuery(FETCH_POSTS_QUERY);
  
  if (error)  return <div>Error...</div>

  return (
    <Grid doubling>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>

      <Grid.Row >
        {user && (
          <Grid.Column computer={5} tablet={8} mobile={16}>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          <Transition.Group>
            {data.getPosts &&
              data.getPosts.map((post: any) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }} computer={5} tablet={8} mobile={16}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
