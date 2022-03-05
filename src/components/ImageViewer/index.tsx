import React from 'react';
import ImageView from 'react-native-image-viewing';

type Props = {
  images: {uri: string}[];
  isVisible: boolean;
  handleClose: () => void;
  imageIndex: number;
};

const ImageViewer: React.FC<Props> = ({
  images,
  isVisible,
  handleClose,
  imageIndex,
}) => {
  return (
    <ImageView
      images={images}
      imageIndex={imageIndex}
      visible={isVisible}
      onRequestClose={handleClose}
    />
  );
};

export default ImageViewer;
