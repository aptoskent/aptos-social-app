import { SafeAreaView, StyleSheet, View } from 'react-native';
import { GLOBAL_BACKGROUND_COLOR } from '../../constants';
import { ContentScrollViewContainer } from './ContentScrollViewContainer';
import { FooterContainer } from './FooterContainer';
import InProgressSpinner from '../../components/InProgressSpinner';

type ScreenWithFooterProps = {
  headerComponent: React.ReactElement;
  contentComponent: React.ReactElement;
  footerComponent: React.ReactElement;
  showSpinner?: boolean;
};

export function ScreenWithFooter({
  headerComponent,
  contentComponent,
  footerComponent,
  showSpinner,
}: ScreenWithFooterProps) {
  return (
    <View style={styles.container}>
      {showSpinner ? (
        <InProgressSpinner inProgress={showSpinner} />
      ) : (
        <>
          <SafeAreaView>{headerComponent}</SafeAreaView>
          <ContentScrollViewContainer>
            {contentComponent}
          </ContentScrollViewContainer>
          <FooterContainer>{footerComponent}</FooterContainer>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
});
