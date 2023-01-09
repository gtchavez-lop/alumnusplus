const $schema_blogComment = {
  blogId: "",
  comment: "",
  createdAt: "",
  id: "",
  type: "",
  updatedAt: "",
  userId: "",
  uploaderDetails: {
    firstName: "",
    lastName: "",
    middleName: "",
    username: "",
  },
};

const $schema_blogUpvoter = {
  blogId: "",
  createdAt: "",
  id: "",
  type: "",
  updatedAt: "",
  userId: "",
  upvoterDetails: {
    firstName: "",
    lastName: "",
    middleName: "",
    username: "",
  },
};

const $schema_blog = {
  comments: [], // $schema_blogComment
  content: "",
  createdAt: "",
  id: "",
  type: "",
  updatedAt: "",
  uploader: {
    email: "",
    firstName: "",
    id: "",
    middleName: "",
    type: "",
    username: "",
  },
  upvoters: [], // $schema_blogUpvoter
};

const $schema_newBlog = {
  content: "",
  createdAt: "",
  id: "",
  type: "",
  updatedAt: "",
  uploaderID: "",
  comments: [], // $schema_blogComment
  upvoters: [], // $schema_blogUpvoter
};

export {
  $schema_blogComment,
  $schema_blogUpvoter,
  $schema_blog,
  $schema_newBlog,
};
