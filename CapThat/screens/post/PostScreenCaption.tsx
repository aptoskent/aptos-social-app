import { useCallback, useContext, useState } from 'react';
import { View, Text } from 'react-native';
import UserProfileTouchableSmall from '../../components/profile_picture/UserProfileTouchableSmall';
import { User } from '../../components/gallery/dataHelper';
import tw from '../../tailwind';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

// utils
import { navigateToProfilescreen } from '../../utils/navigationUtils';
import { AuthContext } from '../../auth/AuthContext';

type PostScreenCaptionProps = {
  creatorUserData: User;
  caption: string;
};

export default function PostScreenCaption({
  creatorUserData,
  caption,
}: PostScreenCaptionProps) {
  const navigation = useTypedNavigation();
  const [isTruncated, setIsTruncated] = useState(true);

  const { userId } = useContext(AuthContext);
  const goToProfileScreen = useCallback(() => {
    const { id, username } = creatorUserData;
    const isOwner = creatorUserData?.id === userId;

    navigateToProfilescreen(navigation, id, username, isOwner);
  }, [userId, creatorUserData, navigation]);

  return (
    <View style={tw('my-2 gap-2 items-start flex-row')}>
      <UserProfileTouchableSmall userData={creatorUserData} />
      <Text
        numberOfLines={isTruncated ? 2 : 0}
        style={tw('text-white text-sm flex-shrink font-clash_regular')}
      >
        <Text onPress={goToProfileScreen} style={tw('font-clash_bold')}>
          {creatorUserData?.username}
          {'  '}
        </Text>
        <Text onPress={() => setIsTruncated(!isTruncated)}>{caption}</Text>
      </Text>
    </View>
  );
}
