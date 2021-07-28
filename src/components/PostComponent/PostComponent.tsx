import { Avatar, Comment } from 'antd';
import Form from 'antd/lib/form';
import TextEditor from 'components/RichTextEditor/RichTextEditor';
import { formatDateTime } from 'core/helpers/date-time';
import { Model } from 'core/models';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import usePostHook from './PostHook';
const { Item: FormItem } = Form;

export interface PostComponentProps<T extends Model> {
  model: T;
  modelClass: new () => T;
  onSubmit: (model: T) => void;
  config?: Record<string, any>;
  children?: any;
  onToggleComment?: () => void;
  onToggleReply?: () => void;
  showComment?: boolean;
  showReply?: boolean;
}

function PostComponent<T extends Model>(props: PostComponentProps<T>) {
  const [translate] = useTranslation();
  const {
    model: defaultModel,
    config,
    onSubmit,
    modelClass,
    children,
    onToggleComment,
    onToggleReply,
    showComment,
    showReply,
  } = props;
  const { model, handleChange, handleSubmit } = usePostHook(
    modelClass,
    defaultModel,
    onSubmit,
  );

  const renderContent = React.useMemo(() => {
    return (item: T) => {
      if (item?.id) {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: item?.content,
            }}
          ></div>
        );
      }
      /* render answer form of post if model has discussionId, else render comment */
      return (
        <>
          <FormItem className="mb-0" labelAlign="left">
            <TextEditor
              value={item?.content}
              editorConfig={config}
              onChange={handleChange}
            />
          </FormItem>
          <div
            className={`d-flex ${
              model.discussionId ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <button
              className={`btn btn-sm btn-primary ${
                model.discussionId ? 'mt-4' : 'mt-2'
              }`}
              disabled={!item?.content}
              onClick={handleSubmit(item)}
            >
              {model.discussionId
                ? translate('general.actions.discuss')
                : translate('general.actions.reply')}
            </button>
          </div>
        </>
      );
    };
  }, [config, handleChange, handleSubmit, model.discussionId, translate]);

  const renderAction = React.useMemo(() => {
    return model => {
      const { id, discussionId } = model;
      if (id && discussionId) {
        return [
          <>
            <span key={uuidv4()} onClick={onToggleReply}>
              {showReply ? translate('general.actions.hideReply') : translate('general.actions.showReply') }
            </span>
          </>,
          <>
            <span key={uuidv4()} onClick={onToggleComment}>
              {showComment ? translate('general.actions.hideComment') : translate('general.actions.showComment')}
            </span>
          </>,
        ];
      }
      return [];
    };
  }, [onToggleComment, onToggleReply, showComment, showReply, translate]);

  const renderPost = React.useMemo(() => {
    return () => (
      <Comment
        actions={renderAction(model)}
        author={model.creator?.username}
        avatar={<Avatar src={model.creator?.avatar} alt="Nam Nguyen" />}
        content={renderContent(model)}
        datetime={formatDateTime(model?.createdAt)}
      >
        {children}
      </Comment>
    );
  }, [children, model, renderAction, renderContent]);

  return <>{renderPost()}</>;
}

export default PostComponent;
