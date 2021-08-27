import { useContext } from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
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
        <Image floated="left" size="small" avatar src="https://react.semantic-ui.com/images/avatar/large/molly.png" />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description style={{wordBreak: 'break-word'}} >{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta style={{display: "flex", justifyContent: "space-between"}} >
          <p>{`${likeCount} likes `}</p>
          <p>{`${likeCount} comments `}</p>
        </Card.Meta>
        <LikeButton post={{ id, likes, likeCount }} user={user} />

        <MyPopup content="Comment on Post">
          <Button as={Link} to={`/posts/${id}`} style={{background: "white"}} >
              <Icon name='comments' style={{color: "#387b67"}} />comments
          </Button>
        </MyPopup>

        {user && user.username === username && <DeleteButton postId={id} /> }
      </Card.Content>
    </Card>
  );
}

export default PostCard;
