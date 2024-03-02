import { ScrollView, StyleSheet, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';

type ContentScrollViewContainerProps = {
  children: React.ReactNode;
};

export function ContentScrollViewContainer({
  children,
}: ContentScrollViewContainerProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL / 2,
  },
});
