export type User = {
  id: string;
  username: string;
  full_name: {
    first_name: string;
    last_name: string;
  };
  birthday?: string;
  pronoun?: string | null;
  email?: string | null;
  phone_number?: string | null;
  profile_picture_img_id?: string | null;
  profile_picture_image?: {
    img_url: string;
  } | null;
  is_test_user: boolean;
};
export type PostImage = {
  id: string;
  img_url: string;
  original_img_url: string;
  thumbnail_url: string;
  metadata: {
    width: number;
    height: number;
  };
};
export type PhotoPost = {
  id: string;
  caption: string;
  image: PostImage;
  created_by_user_id: string;
  created_by_user: User;
};
export type Post = {
  id: string;
  points_gained: number;
  type: string;
  created_at: string;
  group_id: string;
  photo_post: PhotoPost;
  group: Group;
  comments_aggregate: {
    aggregate: {
      count: number;
    };
  };
  reactions: Array<{ id: string; from_user: User }>;
  reactions_aggregate: {
    aggregate: {
      count: number;
    };
  };
};
export type Group = {
  id: string;
  is_private: boolean;
  is_test_group: boolean;
  name: string;
  created_by_user_id?: string;
  posts?: Post[];
  group_user_edges: { user: User | null | undefined }[];
  profile_picture_serial_number: number;
  profile_image: MascotImage;
  test_group_profile_picture_serial_number: number;
  test_group_profile_image: MascotImage;
};
export type UserPostEdge = {
  id: string;
  user_id: string;
  post_id: string;
  post: Post;
};
export type UserGroupEdge = {
  id: string;
  user_id: string;
  group_id: string;
  group: Group;
};
export type PostComment = {
  id: string;
  content: string;
  created_at: string;
  from_user: User;
};
export type PostReaction = {
  id: string;
  type: string;
  created_at: string;
  from_user: User;
};
export type MascotImage = {
  id: number;
  img_url: string;
  serial_number: number;
  background_colors: {
    primary: string;
    secondary: string;
  };
};

const COLUMN_SIZE = 3;

function getMinHeightIndex(colHeightAnchors: number[]) {
  let minIndex = 0;
  for (let i = 1; i < colHeightAnchors.length; i++) {
    if (colHeightAnchors[i] < colHeightAnchors[minIndex]) {
      minIndex = i;
    }
  }
  return minIndex;
}

function updateColHeightAnchors(
  colHeightAnchors: number[],
  colIndex: number,
  photoHeight: number,
) {
  colHeightAnchors[colIndex] += photoHeight;
}

export function getPhotoDataByCol(
  photoDataList: Post[],
  cursor: number,
  limit: number,
  colHeightAnchors: number[],
) {
  if (colHeightAnchors.length !== COLUMN_SIZE) {
    return [];
  }

  const sourceData = photoDataList.slice(cursor, cursor + limit);

  const photoDataByCol: Post[][] = [[], [], []];
  for (let i = 0; i < sourceData.length; i++) {
    const colIndex = getMinHeightIndex(colHeightAnchors);
    updateColHeightAnchors(
      colHeightAnchors,
      colIndex,
      sourceData[i].photo_post.image.metadata.height,
    );
    photoDataByCol[colIndex].push(sourceData[i]);
  }

  return photoDataByCol;
}
