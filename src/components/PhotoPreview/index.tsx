import React from 'react';

import * as S from './styles';

const PhotoPreview: React.FC<{photo: string}> = ({photo}) => {
  return <S.Photo source={{uri: photo}} />;
};

export default PhotoPreview;
