import { Share, StyleSheet, View } from 'react-native';
import Heading2 from '../../components/text/Heading2';
import { HexagonImageType } from '../../components/profile_picture_mascot/HexagonImage';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import PrimaryButton from '../../components/button/PrimaryButton';
import groupInvitationLink from '../../components/GroupInvitationLink';
import { Group } from '../../components/gallery/dataHelper';
import Icon from 'react-native-remix-icon';
import Heading1 from '../../components/text/Heading1';
import TextField from '../../components/TextField';
import GroupMascot from '../../components/profile_picture_mascot/GroupMascot';

type GroupInvitationScreenViewProps = {
  groupData: Group;
};
export default function GroupInvitationScreenView({
  groupData,
}: GroupInvitationScreenViewProps) {
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);

  const { id: groupId, name: groupName, is_private: isPrivate } = groupData;

  useEffect(() => {
    async function createInvitationUrl(groupId: string) {
      const link = await groupInvitationLink(groupId);
      setInvitationUrl(link);
    }

    createInvitationUrl(groupId);
  }, [groupId]);

  const handleShareLink = async () => {
    if (!invitationUrl) {
      console.warn('Unexpected no invitationUrl');
      return;
    }
    try {
      const result = await Share.share({
        message: 'Join my group on CapThat!',
        url: invitationUrl,
      });
      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Content sharing dismissed');
      }
      // TODO: No any
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (!invitationUrl) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainPart}>
        <View style={styles.groupContainer}>
          <GroupMascot
            isTestGroup={groupData.is_test_group}
            type={HexagonImageType.SECONDARY}
            groupPfpSerialNumber={groupData.profile_picture_serial_number}
            groupTestPfpSerialNumber={
              groupData.test_group_profile_picture_serial_number
            }
          />
          <View style={styles.groupNameContainer}>
            {isPrivate && <Icon name="lock-line" size={14} color="white" />}
            <Heading2>{groupName}</Heading2>
          </View>
        </View>
        <View style={styles.qrCodeContainer}>
          <QRCode size={200} value={invitationUrl} />
          <Heading1>CapThat</Heading1>
        </View>
      </View>
      <View style={styles.bottomPart}>
        <TextField
          title="Invite Link"
          value={invitationUrl ?? ''}
          disableEditing
          hasCopyButton
        />
        <PrimaryButton
          title="Share Link"
          iconName="share-forward-line"
          onPress={handleShareLink}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 28,
    justifyContent: 'space-between',
  },
  mainPart: {
    gap: 28,
    marginTop: 40,
  },
  groupContainer: {
    alignItems: 'center',
    gap: 12,
  },
  groupNameContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
    gap: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },
  bottomPart: {
    gap: 16,
  },
});
