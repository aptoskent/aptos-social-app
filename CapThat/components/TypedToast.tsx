// import Toast from 'react-native-toast-message';

export enum ToastType {
  ERROR = 'error',
}

export class TypedToast {
  static show({ type }: { type: ToastType }) {
    if (type === ToastType.ERROR) {
      return;
      //Toast.show({type})
    }
  }
}
