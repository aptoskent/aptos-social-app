import { SafeAreaView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AccountSettingHeader from './AccountSettingHeader';
import { styles } from './styles';
import DatePicker from 'react-native-datepicker';
import React from 'react';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { useMutation } from '@apollo/client';
import { getUserByAuthIdQuery } from '../../gql/getUserByAuthIdQuery';
import { updateDOBMutation } from '../../gql/updateDOBMutation';
import InProgressSpinner from '../../components/InProgressSpinner';
import PrimaryButton from '../../components/button/PrimaryButton';
import GlobalText from '../../components/text/GlobalText';

// styles
import tw from '../../tailwind.js';

import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import ErrorView from '../../components/error_state/ErrorView';
import { TypedToast } from '../../components/TypedToast';
import { ToastType } from '../../components/TypedToast';

type BirthdaySettingScreenProps = {
  route: any;
};

export default function BirthdaySettingScreen({
  route,
}: BirthdaySettingScreenProps) {
  const navigation = useTypedNavigation();
  const birthday = route.params.birthday;
  const [newBirthday, setNewBirthday] = useState(birthday);

  const user = auth().currentUser;
  if (user === null) {
    return <ErrorView />;
  }
  const [updateBirthday, { loading, error }] = useMutation(updateDOBMutation, {
    variables: {
      auth_id: user.uid,
      birthday: newBirthday,
    },
    refetchQueries: [
      {
        query: getUserByAuthIdQuery,
        variables: {
          auth_id: user.uid,
        },
      },
    ],
  });
  const handleUpdateBirthday = () => {
    updateBirthday().then(() => navigation.goBack());
  };

  if (loading) {
    return <InProgressSpinner inProgress={loading} />;
  }

  if (error) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  return (
    <SafeAreaView style={styles.container}>
      <AccountSettingHeader title={'Birthday'} />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
      >
        <DatePicker
          style={styles.datePicker}
          date={newBirthday}
          mode="date"
          placeholder="YYYY-MM-DD"
          format="YYYY-MM-DD"
          maxDate={new Date()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          customStyles={{
            dateInput: styles.dateInput,
            placeholderText: styles.placeholderText,
            dateText: styles.dateText,
            btnTextConfirm: styles.btnText,
            btnTextCancel: styles.btnText,
            datePickerCon: styles.datePickerCon,
          }}
          onDateChange={setNewBirthday}
        />
        <PrimaryButton
          title={'Save'}
          onPress={handleUpdateBirthday}
          propStyles={tw('my-2')}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
