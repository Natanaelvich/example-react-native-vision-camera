import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Alert, View} from 'react-native';
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
import ImageViewer from '../ImageViewer';
import {
  HandlerStateChangeEvent,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

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
  const [showImageViewer, setShowImageViewer] = useState(false);

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
      const result = await camera.current?.takePhoto();

      if (result) {
        setPhotos(prevPhotos => [...prevPhotos, result]);
      }
    } catch (e) {
      Alert.alert(`Error: ${e}`);
    }
  };

  const onRandomZoomPress = useCallback(() => {
    zoom.value = withSpring(Math.random());
  }, [zoom]);

  const flipCamera = () => setFrontCamera(prevState => !prevState);
  const toggleTorch = () => setTorchActive(prevState => !prevState);
  const handleOpenImageViewer = () => {
    if (photos.length > 0) {
      setShowImageViewer(true);
    }
  };

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

  const animatedProps = useAnimatedProps<Partial<CameraProps>>(
    () => ({zoom: zoom.value}),
    [zoom],
  );

  const gestureTapToFocus = (
    event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>,
  ) => {
    camera.current?.focus({
      x: Math.floor(event.nativeEvent.x),
      y: Math.floor(event.nativeEvent.y),
    });
  };

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
      <TapGestureHandler onHandlerStateChange={gestureTapToFocus}>
        <ReanimatedCamera
          ref={camera}
          // style={StyleSheet.absoluteFill}
          style={{flex: 1}}
          device={currentDevice}
          isActive={true}
          photo={true}
          torch={torchActive ? 'on' : 'off'}
          enableZoomGesture
          animatedProps={animatedProps}
        />
      </TapGestureHandler>

      <S.Buttons>
        <S.Button onPress={handleOpenImageViewer}>
          {photos.length > 0 ? (
            <S.WrapperImage>
              <PhotoPreview
                photo={`file://${photos[photos.length - 1].path}`}
              />
            </S.WrapperImage>
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

      <ImageViewer
        images={photos.map(p => ({uri: `file://${p.path}`}))}
        isVisible={showImageViewer}
        handleClose={() => setShowImageViewer(false)}
        imageIndex={photos.length - 1}
      />
    </S.Container>
  );
}

export default Camera;
