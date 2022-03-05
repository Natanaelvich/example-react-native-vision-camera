import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Camera from './components/Camera';

const Main: React.FC = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Camera />
    </GestureHandlerRootView>
  );
};

export default Main;
