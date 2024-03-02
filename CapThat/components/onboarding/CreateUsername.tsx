import { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import PrimaryTextInput from '../../components/PrimaryTextInput';
import GlobalText from '../../components/text/GlobalText';

// styles
import tw from '../../tailwind.js';

// Config
const CONDITIONS = [
  {
    id: 0,
    message: 'Between 2 and 20 characters.',
    condition: (text: string) => text?.length < 20 && text?.length > 1,
  },
  {
    id: 1,
    message: 'Only uses lowercase letters, numbers. periods, and underscores.',
    // Also accepts hyphens and underscores
    condition: (text: string) => /^[a-z0-9_.]+$/.test(text),
  },
];

type Props = {
  onValidUsername: (text: string) => void;
  propsStyle?: object;
};

const CreateUsername = (props: Props) => {
  const { onValidUsername, propsStyle } = props;
  const [username, setUsername] = useState('');

  const conditionsMet = new Array(CONDITIONS.length).fill(true);

  useEffect(() => {
    const isValidUsername = conditionsMet.every((isValid) => isValid);
    if (isValidUsername) {
      onValidUsername?.(username);
    } else {
      onValidUsername?.('');
    }
  }, [conditionsMet, onValidUsername, username]);

  // @ts-ignore: item is an Object
  const renderItem = useCallback(
    ({ item }) => {
      const { id, message, condition } = item;

      const isValid = condition(username) && username?.length > 0;
      conditionsMet[id] = isValid;
      return (
        <View style={tw('flex-row px-2')}>
          <GlobalText
            key={id + 'bullet'}
            propStyles={tw('text-sm', isValid && 'text-success')}
          >
            {'\u2022   '}
          </GlobalText>
          <GlobalText
            key={id + 'message'}
            propStyles={tw('text-sm', isValid && 'text-success')}
          >
            {message}
          </GlobalText>
        </View>
      );
    },
    [conditionsMet, username],
  );

  return (
    <View style={propsStyle}>
      <PrimaryTextInput
        title={'Username'}
        placeholder={''}
        onTextChange={setUsername}
        autoCapitalize={'none'}
        value={username}
        propsStyle={tw('h-20')}
      />
      <FlatList data={CONDITIONS} renderItem={renderItem} />
    </View>
  );
};

export default CreateUsername;
