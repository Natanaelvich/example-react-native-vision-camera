import React, {useEffect} from 'react';

import {View} from 'react-native';
import {Camera} from 'react-native-vision-camera';

const App = () => {
  useEffect(() => {
    async function getPermissionCamera() {
      const cameraPermission = await Camera.getCameraPermissionStatus();
    }

    getPermissionCamera();
  }, []);

  useEffect(() => {
    async function getDevices() {
      const devices = await Camera.getAvailableCameraDevices();

      console.log(devices);
    }
  }, []);

  return <View />;
};

export default App;
