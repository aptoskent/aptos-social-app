import { useState } from 'react';
import { View, Text } from 'react-native';
import globalStyles from './styles';
import { SCREEN_NAME_PRONOUN } from '../../nav/constants';

import DatePicker from 'react-native-datepicker';
import auth from '@react-native-firebase/auth';
import PrimaryButton from '../../components/button/PrimaryButton';
import Heading1 from '../../components/text/Heading1';
import ValidationModal from '../../components/modal/ValidationModal';
import { UserInfo } from '../../auth/utils';

import moment from 'moment';

// styles
import tw from '../../tailwind';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { LogEvent, LogEventButtonName } from '../../constants';

type DOBScreenProps = {
  route: any;
};

export default function DOBScreen({ route }: DOBScreenProps) {
  const navigation = useTypedNavigation();
  const placeholderDate = moment()
    .subtract(17, 'years')
    .format('MMMM Do, YYYY');

  const [birthday, setBirthday] = useState(placeholderDate);
  const [isFocusedDate, setIsFocusedDate] = useState(false);
  const [showAgeValidationModal, setShowAgeValidationModal] = useState(false);
  // init the userInfo to pass on the onboarding screens
  const userInfo: UserInfo = {
    birthday: '',
    pronoun: '',
    username: '',
    full_name: { first_name: '', last_name: '' },
    invite_code: route.params?.inviteCode,
  };

  const onContinueButtonPress = () => {
    const user = auth().currentUser;
    const parsedDate = moment(birthday, 'MMMM Do, YYYY');
    const isUnder13 = moment().diff(moment(parsedDate), 'years') < 13;

    if (isUnder13) {
      setShowAgeValidationModal(isUnder13);
      return;
    }

    if (user) {
      const parsedDate = moment(birthday, 'MMMM Do, YYYY');
      userInfo.birthday = moment(parsedDate).format('YYYY-MM-DD');
    }
    navigation.navigate(SCREEN_NAME_PRONOUN, { userInfo });
  };

  const handleDateChange = (date: any) => {
    setBirthday(date);
  };

  return (
    <View style={tw('flex-1 justify-between bg-background pt-30 px-4 pb-8')}>
      <View style={tw('flex-grow gap-12')}>
        <View style={tw('gap-2 justify-center')}>
          <Heading1>{`When's your birthday?`}</Heading1>
          <Text style={tw('ft-global text-center')}>
            This information helps keep the CapThat community safe. Your
            information will be protected.
          </Text>
        </View>
        <DatePicker
          style={tw('w-full')}
          date={birthday}
          mode="date"
          placeholder={placeholderDate}
          maxDate={new Date()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          format="MMMM Do, YYYY"
          showIcon={false}
          customStyles={{
            dateInput: {
              ...globalStyles.dateInput,
              borderColor: isFocusedDate ? '#6F83E9' : '#ccc',
            }, // Only accepts object, array of objects won't work
            placeholderText: globalStyles.placeholderText,
            dateText: globalStyles.dateText,
            btnTextConfirm: globalStyles.btnText,
            btnTextCancel: globalStyles.btnText,
            datePickerCon: globalStyles.datePickerCon,
          }}
          onDateChange={handleDateChange}
          onOpenModal={() => setIsFocusedDate(true)}
          onCloseModal={() => setIsFocusedDate(false)}
        />
      </View>
      {/* Datepicker ios modal has ios height of 216px. Shifting continue button 224px*/}
      <View style={tw('pb-4', isFocusedDate && 'mb-56')}>
        <PrimaryButton
          title={'Continue'}
          onPress={onContinueButtonPress}
          pressEventName={LogEvent.BUTTON}
          pressEventParams={{
            button: LogEventButtonName.CONFIRM_BIRTHDAY,
          }}
        />
      </View>
      {showAgeValidationModal && (
        <ValidationModal closeModal={() => setShowAgeValidationModal(false)} />
      )}
    </View>
  );
}
