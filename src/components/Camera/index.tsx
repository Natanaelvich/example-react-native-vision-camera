import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {
  Camera as CameraVision,
  CameraPermissionRequestResult,
  useCameraDevices,
} from 'react-native-vision-camera';

import * as S from './styles';

function Camera() {
  const camera = useRef<CameraVision>(null);

  const [torchActive, setTorchActive] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const [permissionResult, setPermissionResult] =
    useState<CameraPermissionRequestResult>('denied');

  /* Here we use hook provided by library to take available devices (lenses) */
  const availableDevices = useCameraDevices();

  /* useCameraDevices hook returns an object with front/back properties,
     that you can use to switch between back and front camera */
  const currentDevice =
    frontCamera && availableDevices?.front
      ? availableDevices.front
      : availableDevices?.back;

  const takePhoto = async () => {
    try {
      const result = await camera.current?.takePhoto();
      console.log(result);
    } catch (e) {
      Alert.alert(`Error: ${e}`);
    }
  };

  const flipCamera = () => setFrontCamera(prevState => !prevState);
  const toggleTorch = () => setTorchActive(prevState => !prevState);

  useEffect(() => {
    async function getPermission() {
      try {
        const cameraPermission = await CameraVision.requestCameraPermission();

        setPermissionResult(cameraPermission);
      } catch (error) {
        Alert.alert(
          'permissão da câmera',
          'Não foi possível recuperar permissão da câmera.',
        );
      }
    }

    getPermission();
  }, []);

  /* There is an additional check to prevent errors.
     Camera component needs a valid device prop,
     we need to stop rendering if the device is falsy value. */
  if (!currentDevice) {
    return null;
  }

  if (permissionResult === 'denied') {
    return null;
  }

  return (
    <S.Container>
      <CameraVision
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={currentDevice}
        isActive={true}
        photo={true}
        torch={torchActive ? 'on' : 'off'}
      />

      <S.Buttons>
        <S.Button onPress={toggleTorch} />
        <S.Button onPress={takePhoto} />
        <S.Button onPress={flipCamera} />
      </S.Buttons>
    </S.Container>
  );
}

export default Camera;
