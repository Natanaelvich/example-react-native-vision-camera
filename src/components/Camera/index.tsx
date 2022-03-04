import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Camera as CameraVision,
  CameraPermissionRequestResult,
  CameraProps,
  PhotoFile,
  useCameraDevices,
} from 'react-native-vision-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PhotoPreview from '../PhotoPreview';

import * as S from './styles';

const ReanimatedCamera = Animated.createAnimatedComponent(CameraVision);
Animated.addWhitelistedNativeProps({
  zoom: true,
});

function Camera() {
  const camera = useRef<CameraVision>(null);

  const [torchActive, setTorchActive] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const [permissionResult, setPermissionResult] =
    useState<CameraPermissionRequestResult>('denied');
  const [photos, setPhotos] = useState<PhotoFile[]>([]);

  /* Here we use hook provided by library to take available devices (lenses) */
  const availableDevices = useCameraDevices();

  /* useCameraDevices hook returns an object with front/back properties,
     that you can use to switch between back and front camera */
  const currentDevice =
    frontCamera && availableDevices?.front
      ? availableDevices.front
      : availableDevices?.back;

  const zoom = useSharedValue(0);

  const takePhoto = async () => {
    try {
      const result = await camera.current?.takePhoto({
        skipMetadata: true,
        flash: 'off',
        qualityPrioritization: 'speed',
      });

      if (result) {
        setPhotos(prevPhotos => [...prevPhotos, result]);
      }
    } catch (e) {
      Alert.alert(`Error: ${e}`);
    }
  };

  const handleFocusOnTap = async () => {
    try {
      await camera.current?.focus({x: 12, y: 12});
    } catch (e) {
      Alert.alert(`Error: ${e}`);
    }
  };

  const onRandomZoomPress = useCallback(() => {
    zoom.value = withSpring(Math.random());
  }, [zoom]);

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

  useEffect(() => {
    console.log(currentDevice?.supportsFocus);
    console.log(currentDevice?.maxZoom);
    console.log(currentDevice?.minZoom);
    console.log(currentDevice?.isMultiCam);
  }, [currentDevice]);

  const animatedProps = useAnimatedProps<Partial<CameraProps>>(
    () => ({zoom: zoom.value}),
    [zoom],
  );

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
      <ReanimatedCamera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={currentDevice}
        isActive={true}
        photo={true}
        torch={torchActive ? 'on' : 'off'}
        enableZoomGesture
        animatedProps={animatedProps}
      />

      <S.Buttons>
        <S.Button>
          {photos.length > 0 ? (
            <PhotoPreview photo={`file://${photos[0].path}`} />
          ) : (
            <MaterialIcons name="image-not-supported" size={24} color="black" />
          )}
        </S.Button>
        <S.Button onPress={takePhoto}>
          <MaterialIcons name="camera-alt" size={24} color="black" />
        </S.Button>
        <S.Button onPress={flipCamera}>
          {frontCamera ? (
            <MaterialIcons name="camera-rear" size={24} color="black" />
          ) : (
            <MaterialIcons name="camera-front" size={24} color="black" />
          )}
        </S.Button>
      </S.Buttons>
    </S.Container>
  );
}

export default Camera;
