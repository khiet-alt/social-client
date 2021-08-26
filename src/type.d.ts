type Like = {
    id: string
    username: string
    createdAt: string
  }
  
type Comment = {
    id: string
    username: string
    createdAt: string
    body: string
  }
  
type Post = {
    body: string
    createdAt: string
    id: string
    username: string
    likeCount: number
    commentCount: number
    likes: Like[]
    comments: Comment[]
}