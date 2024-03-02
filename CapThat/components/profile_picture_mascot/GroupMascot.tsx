import storage from '@react-native-firebase/storage';
import HexagonImage, { HexagonImageType } from './HexagonImage';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { getMascotImagesUsedQuery } from '../../gql/getMascotImageUsedQuery';
import { View } from 'react-native';
import { useDownloadUrlForImage } from '../../hooks/useDownloadUrlForImage';
import { getMascotImagesReusableQuery } from '../../gql/getLastMascotImageReusableQuery';
import Toast from 'react-native-toast-message';

type GroupMascotProps = {
  isTestGroup: boolean;
  groupPfpSerialNumber?: number | null;
  groupTestPfpSerialNumber?: number | null;
  type: HexagonImageType;
};

export default function GroupMascot({
  isTestGroup,
  groupPfpSerialNumber,
  groupTestPfpSerialNumber,
  type,
}: GroupMascotProps) {
  return isTestGroup ? (
    <TestGroupMascot
      groupTestPfpSerialNumber={groupTestPfpSerialNumber}
      type={type}
    />
  ) : (
    <NonTestGroupMascot
      groupPfpSerialNumber={groupPfpSerialNumber}
      type={type}
    />
  );
}

type TestGroupMascotProps = {
  groupTestPfpSerialNumber?: number | null;
  type: HexagonImageType;
};

function TestGroupMascot({
  groupTestPfpSerialNumber,
  type,
}: TestGroupMascotProps) {
  const [imageUri, setImageUri] = useState<string>();

  const { loading, error } = useQuery(getMascotImagesReusableQuery, {
    variables: {
      serial_number: groupTestPfpSerialNumber || 0,
    },
    onCompleted: (result) => {
      if (result.mascot_image_reusable.length === 0) {
        // old groups don't have real profile image
        // console.error("No mascot image found!");
        return;
      }
      storage()
        .ref(result.mascot_image_reusable[0].img_url)
        .getDownloadURL()
        .then((result) => {
          setImageUri(result);
        });
    },
  });

  if (loading) {
    return <View></View>;
  }

  if (error) {
    Toast.show({ type: 'error' });
  }

  return <HexagonImage type={type} uri={imageUri} loading={loading} />;
}

type NonTestGroupMascotProps = {
  groupPfpSerialNumber?: number | null;
  type: HexagonImageType;
};

function NonTestGroupMascot({
  groupPfpSerialNumber,
  type,
}: NonTestGroupMascotProps) {
  const {
    data: mascotImageResult,
    loading,
    error,
  } = useQuery(getMascotImagesUsedQuery, {
    variables: {
      serial_number: groupPfpSerialNumber || 0,
    },
  });

  const { downloadUrl: imageUri, error: imageError } = useDownloadUrlForImage(
    mascotImageResult?.mascot_image_used[0]?.img_url,
  );

  if (loading) {
    return <View></View>;
  }

  if (error) {
    Toast.show({ type: 'error' });
  }

  return <HexagonImage type={type} uri={imageUri} loading={loading} />;
}
