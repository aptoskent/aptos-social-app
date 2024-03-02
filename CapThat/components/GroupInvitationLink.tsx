import dynamicLinks from '@react-native-firebase/dynamic-links';

export const groupInvitationLink = async (groupId: string) => {
  return dynamicLinks().buildShortLink({
    link: 'https://capthat.page.link/' + groupId,
    domainUriPrefix: 'https://capthat.page.link',
    ios: {
      bundleId: 'com.aptos.capthat',
      appStoreId: '6449201945',
      fallbackUrl: 'https://apps.apple.com/us/app/capthat/id6449201945',
    },
  });
};

export default groupInvitationLink;
