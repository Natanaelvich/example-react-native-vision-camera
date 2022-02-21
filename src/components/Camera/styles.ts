import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  position: relative;
`;

export const Buttons = styled.View`
  position: absolute;
  flex-direction: row;
  justify-content: space-between;

  right: 0;
  left: 0;
  bottom: 0;
  padding: 24px;
`;

export const Button = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: white;

  align-items: center;
  justify-content: center;
`;
