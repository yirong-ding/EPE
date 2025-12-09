import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Send, 
  TrendingUp,
  Clock,
  ArrowLeft,
  Leaf
} from "lucide-react";
import { forumPosts as initialPosts, ForumPost, Comment } from "../data/forumData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Navigation } from "./Navigation";

interface ForumProps {
  onBack: () => void;
  onAccountClick: () => void;
}

export function Forum({ onBack, onAccountClick }: ForumProps) {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<"hot" | "recent">("hot");

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "hot") {
      return (b.likes + b.views / 10) - (a.likes + a.views / 10);
    } else {
      return 0; // Already sorted by time
    }
  });

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    const comment: Comment = {
      id: Date.now(),
      author: "Me",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me",
      content: newComment,
      time: "Just now",
      likes: 0
    };

    const updatedPosts = posts.map(post => {
      if (post.id === selectedPost.id) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setSelectedPost({
      ...selectedPost,
      comments: [...selectedPost.comments, comment]
    });
    setNewComment("");
  };

  const handleLikePost = (postId: number) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({ ...selectedPost, likes: selectedPost.likes + 1 });
    }
  };

  const handleLikeComment = (commentId: number) => {
    if (!selectedPost) return;

    const updatedComments = selectedPost.comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    });

    const updatedPost = { ...selectedPost, comments: updatedComments };
    setSelectedPost(updatedPost);

    const updatedPosts = posts.map(post => {
      if (post.id === selectedPost.id) {
        return updatedPost;
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Navigation onAccountClick={onAccountClick} showAccount={true} isAccountPage={false} />
        <div className="p-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedPost(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedPost.avatar} alt={selectedPost.author} />
                  <AvatarFallback>{selectedPost.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="mb-2">{selectedPost.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{selectedPost.author}</span>
                    <span>•</span>
                    <span>{selectedPost.time}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-relaxed">{selectedPost.content}</p>
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-6 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikePost(selectedPost.id)}
                  className="gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {selectedPost.likes}
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {selectedPost.views}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {selectedPost.comments.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Comments ({selectedPost.comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedPost.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 pb-6 border-b last:border-b-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.avatar} alt={comment.author} />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="mb-3">{comment.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment.id)}
                      className="gap-2 h-8"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {comment.likes > 0 && comment.likes}
                    </Button>
                  </div>
                </div>
              ))}

              <div className="pt-4 space-y-3">
                <h4>Post a Comment</h4>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-24"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navigation onAccountClick={onAccountClick} showAccount={true} isAccountPage={false} />
      <div className="p-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl">Environmental Forum</h1>
              <p className="text-muted-foreground">Share environmental experiences, exchange green living ideas</p>
            </div>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758270704787-615782711641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBkaXNjdXNzaW9uJTIwZ3JvdXB8ZW58MXx8fHwxNzYwOTUwNDA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Community Discussion"
                className="w-full h-full object-cover"
              />
            </div>
          </CardHeader>
        </Card>

        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "hot" | "recent")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="hot" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Hot
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="h-4 w-4" />
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value={sortBy} className="space-y-4 mt-6">
            {sortedPosts.map((post) => (
              <Card 
                key={post.id} 
                className="cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => setSelectedPost(post)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.avatar} alt={post.author} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="mb-2 hover:text-green-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {post.comments.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}
