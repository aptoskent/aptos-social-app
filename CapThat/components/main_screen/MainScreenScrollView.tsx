import { Animated, StyleSheet, View } from 'react-native';
import { GLOBAL_BACKGROUND_COLOR } from '../../constants';
import { useState } from 'react';
import UserGalleryView from '../../components/gallery/UserGalleryView';
import GroupGalleryView from '../../components/gallery/GroupGalleryView';
import { Group } from '../gallery/dataHelper';
import { ProfileScreenType } from './ProfileScreenType';

const PFP_SCROLL_UP_OFFSET = 56;

type MainScreenScrollViewProps = {
  profileId: string;
  type: ProfileScreenType;
  profilePictureComponent: () => React.ReactElement;
  middleComponent: React.ReactElement;
  profilePictureTopOffset: number;
  contentTopOffset: number;
  userGroups?: Group[];
  isOwner?: boolean;
};

export default function MainScreenScrollView({
  profileId,
  type,
  profilePictureComponent,
  middleComponent,
  profilePictureTopOffset,
  contentTopOffset,
  userGroups,
  isOwner,
}: MainScreenScrollViewProps) {
  const scrollOffset = new Animated.Value(0);
  const pictureOpacity = new Animated.Value(1);
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // TODO: @zihan clean up this mess
  const handleScroll = (event) => {
    // 1. Scroll the profile picture up and down
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollOffset.setValue(offsetY);

    // Determine whether to show or hide the profile picture based on the scroll direction
    if (offsetY > PFP_SCROLL_UP_OFFSET && showProfilePicture) {
      setShowProfilePicture(false);
      Animated.timing(pictureOpacity, {
        toValue: 0,
        duration: 200, // Adjust the duration as needed
        useNativeDriver: true,
      }).start();
    } else if (offsetY <= PFP_SCROLL_UP_OFFSET && !showProfilePicture) {
      setShowProfilePicture(true);
      Animated.timing(pictureOpacity, {
        toValue: 1,
        duration: 200, // Adjust the duration as needed
        useNativeDriver: true,
      }).start();
    }

    // 2. Fetch more data when the user reaches the end of the scroll view
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const endScrollOffset = event.nativeEvent.contentOffset.y;

    // Check if the user has reached the end of the scroll view
    const detectEndReached =
      contentHeight - endScrollOffset <= scrollViewHeight;

    if (detectEndReached && !isEndReached) {
      // Set the flag indicating that the end has been reached
      setIsEndReached(true);
      // Reset the flag after a delay of 500ms
      setTimeout(() => setIsEndReached(false), 500);
    }

    // 3. Refresh when the user pulls down the scroll view
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const refreshThreshold = 50; // Adjust the threshold as needed

    const detectRefreshing = scrollPosition < -refreshThreshold;

    if (detectRefreshing && !isRefreshing) {
      // User is dragging the scroll view down beyond the refresh threshold
      setIsRefreshing(true);
      // Reset the flag after a delay of 500ms
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <View style={styles.container}>
      {showProfilePicture && (
        <Animated.View
          style={[
            styles.profilePictureContainer,
            {
              top: -profilePictureTopOffset,
              opacity: pictureOpacity,
              transform: [
                {
                  translateY: scrollOffset.interpolate({
                    inputRange: [0, 200],
                    outputRange: [0, -200],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          {profilePictureComponent()}
        </Animated.View>
      )}
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingTop: contentTopOffset,
            alignItems: 'center',
          }}
        >
          {middleComponent}
          {type === ProfileScreenType.USER && (
            <UserGalleryView
              isEndReached={isEndReached}
              isRefreshing={isRefreshing}
              userGroups={userGroups!}
              isOwner={isOwner!}
            />
          )}
          {type === ProfileScreenType.GROUP && (
            <GroupGalleryView
              groupId={profileId}
              isEndReached={isEndReached}
              isRefreshing={isRefreshing}
            />
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  profilePictureContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
});
