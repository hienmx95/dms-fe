import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { Post } from 'models/Post';
import { PostFilter } from 'models/PostFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

export interface IndirectSalesOrderCommentProps {
  onSave?: () => void;
  onClose?: () => void;
  currentItem: IndirectSalesOrder;
  setCurrentItem?: Dispatch<SetStateAction<IndirectSalesOrder>>;
  posts?: Post[];
  setPosts?: Dispatch<SetStateAction<Post[]>>;
  createPost?: (model: Post) => Promise<Post>;
  listPost?: (filter: PostFilter) => Promise<Post[]>;
  createComment?: (model: Comment) => Promise<Comment>;
  problemId?: number;
}

function IndirectSalesOrderComment() {

  const [translate] = useTranslation();

  // const [config] = React.useState<EditorConfig>(
  //   new EditorConfig(
  //     '100%',
  //     50,
  //     false,
  //     false,
  //     false,
  //     setup,
  //     defaultContentStyle,
  //     [],
  //     undefined,
  //     'raw',
  //   ),
  // );


  return (
    <div className="indirect-sales-order-comment">
      <div className="post">
        {translate('indirectSalesOrders.post.title')}
      </div>
    </div>
  );

}


// const setup = editor => {
//   editor.ui.registry.addAutocompleter('autocompleter-flags', {
//     ch: '@',
//     minChars: 2,
//     columns: 1,
//     fetch: pattern => {
//       const filter = {
//         ...new AppUserFilter(),
//         displayName: { contain: pattern },
//       };
//       return new Promise(resolver => {
//         indirectSalesOrderRepository.singleListAppUser(filter).then(list => {
//           const results = list.map(item => ({
//             ...item,
//             value: `${item.username};${item.id}`,
//             text: item.username,
//           }));
//           resolver(results);
//         });
//       });
//     },
//     onAction: (autocompleteApi, rng, value) => {
//       /* inject html input with user data-id */
//       const detail = value.split(';');
//       const el = `<span class="editor-tag-name"><input type="hidden" data-id="${detail[1]}" />${detail[0]} </span><span>&#8203</span>`;
//       editor.selection.setRng(rng);
//       editor.insertContent(el);
//       autocompleteApi.hide();
//     },
//   });
// };

export default IndirectSalesOrderComment;
