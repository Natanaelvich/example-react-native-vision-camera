import {RectButton} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Buttons = styled.View`
  flex-direction: row;
  justify-content: space-between;

  right: 0;
  left: 0;
  bottom: 0;
  padding: 24px;
  background: black;
`;

export const Button = styled(RectButton)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: white;

  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const WrapperImage = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  overflow: hidden;
`;

export const Photo = styled.Image`
  height: 100%;
  width: 100%;
`;
