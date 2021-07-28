import { Post } from 'models/Post';
import React, { useState, useCallback, useMemo } from 'react';
import { Comment } from 'models/Comment';
import PostComponent from 'components/PostComponent/PostComponent';
import { AppUser } from 'models/AppUser';
export interface PostViewProps {
  model?: Post;
  creator?: AppUser;
  config?: Record<string, any>;
  onSubmit: (model: any) => void;
  children?: any;
}

export default function PostView(props: PostViewProps) {
  const { model, config, onSubmit, creator } = props;
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showComment, setShowComment] = useState<boolean>(true);

  const handleToggleComment = useCallback(() => {
    setShowComment(!showComment);
  }, [showComment]);

  const handleToggleReply = useCallback(() => {
    setShowReply(!showReply);
  }, [showReply]);

  const renderPost = useMemo(() => {
    return () => (
      <>
        <PostComponent
          model={model}
          modelClass={Post}
          config={config}
          onSubmit={onSubmit}
          onToggleComment={handleToggleComment}
          onToggleReply={handleToggleReply}
          showComment={showComment}
          showReply={showReply}
        >
          {/* render comments */}
          {model.comments?.length > 0 &&
            showComment &&
            model.comments.map((item: Comment) => (
              <div key={item.id}>
                <PostComponent
                  model={item}
                  modelClass={Comment}
                  config={config}
                  onSubmit={onSubmit}
                />
              </div>
            ))}
          {/* render reply */}
          {showReply && (
            <div key={model.id}>
              <PostComponent
                model={{ ...new Comment(), postId: model.id, creator }}
                modelClass={Comment}
                config={config}
                onSubmit={onSubmit}
              />
            </div>
          )}
        </PostComponent>
      </>
    );
  }, [
    config,
    creator,
    handleToggleComment,
    handleToggleReply,
    model,
    onSubmit,
    showComment,
    showReply,
  ]);
  return <>{renderPost()}</>;
}

PostView.defaultProps = {
  model: {},
  creator: new AppUser(),
};
