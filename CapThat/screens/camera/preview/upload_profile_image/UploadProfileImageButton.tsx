import { TouchableOpacity, Text } from 'react-native';
import {
  GLOBAL_PRIMARY_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../../../constants';
import { useMutation } from '@apollo/client';
import { insertProfileImageMutation } from '../../../../gql/insertProfileImageMutation';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import { AuthContext } from '../../../../auth/AuthContext';
import { useContext } from 'react';
import { SCREEN_NAME_MY_PROFILE } from '../../../../nav/constants';
import { getUserQuery } from '../../../../gql/getUserQuery';
import { TEXT_COLOR_PRIMARY } from '../../../../components/text/constants';
import InProgressSpinner from '../../../../components/InProgressSpinner';
import { IMAGE_FORMAT } from '../../ratio';
import { useTypedNavigation } from '../../../../hooks/useTypedNavigation';

type UploadProfileImageButtonProps = {
  imageUri: string;
  thumbnailUri: string;
};

export default function UploadProfileImageButton({
  imageUri,
  thumbnailUri,
}: UploadProfileImageButtonProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);
  const [insertProfileImage, { loading, error }] = useMutation(
    insertProfileImageMutation,
    {
      refetchQueries: [
        {
          query: getUserQuery,
          variables: {
            user_id: userId,
          },
        },
      ],
    },
  );

  const onUpload = () => {
    const firebaseImagePath = `/profile_images/users/${userId}/images/${uuidv4()}.${IMAGE_FORMAT}`;
    const firebaseThumbnailPath = `/profile_images/users/${userId}/thumbnails/${uuidv4()}.${IMAGE_FORMAT}`;
    const reference = storage().ref(firebaseImagePath);
    const thumbnailReference = storage().ref(firebaseThumbnailPath);

    reference.putFile(imageUri).then(() => {
      thumbnailReference.putFile(thumbnailUri).then(() => {
        insertProfileImage({
          variables: {
            user_id: userId,
            image_id: uuidv4(),
            img_url: firebaseImagePath,
            original_img_url: firebaseImagePath,
            thumbnail_url: firebaseThumbnailPath,
            metadata: {
              width: 50,
              height: 50,
            },
          },
        });
      });
    });

    navigation.navigate(SCREEN_NAME_MY_PROFILE);
  };

  return (
    <>
      <TouchableOpacity
        style={{
          backgroundColor: GLOBAL_PRIMARY_COLOR,
          padding: 16,
          borderRadius: 16,
          flex: 1,
          alignItems: 'center',
          marginRight: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
        }}
        onPress={() => onUpload()}
      >
        <Text
          style={{
            fontFamily: 'clash-display-bold',
            color: TEXT_COLOR_PRIMARY,
            fontSize: 16,
          }}
        >
          Upload Profile Image
        </Text>
      </TouchableOpacity>
      <InProgressSpinner inProgress={loading} />
    </>
  );
}
