import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import MyPopup from '../util/MyPopup'

import { AuthContext } from '../context/auth';

function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes }}: {post: Post}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image floated="right" size="mini" src="https://react.semantic-ui.com/images/avatar/large/molly.png" />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton post={{ id, likes, likeCount }} user={user} />

        <MyPopup content="Comment on Post">
          <Button labelPosition='right' as={Link} to={`/posts/${id}`} >
            <Button basic color='blue'>
              <Icon name='comments' />
            </Button>
            <Label basic color='blue' pointing='left'>
              {commentCount}
            </Label>
          </Button>
        </MyPopup>

        {user && user.username === username && <DeleteButton postId={id} /> }
      </Card.Content>
    </Card>
  );
}

export default PostCard;
