import { Flex } from '@chakra-ui/react';
import { FilePond, registerPlugin } from 'react-filepond';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { getItem } from '@clevery-lms/data';

registerPlugin(FilePondPluginImagePreview);

export interface InformationFilepondProps {
  name: string;
  label: string;
  putEP: string;
  isDisabled?: boolean;
  style?: React.CSSProperties;
}

export const InformationFilepond = ({
  name,
  label,
  putEP,
  isDisabled,
  style,
}: InformationFilepondProps) => {
  return (
    <Flex fontSize="14px" direction="column" style={style}>
      <label className="information-block-label">{label}</label>

      <FilePond
        name={name}
        disabled={isDisabled}
        server={{
          url: process.env.REACT_APP_API_URL,
          process: {
            url: putEP,
            method: 'PUT',
            headers: { Authorization: `Bearer ${getItem('loginToken')}` },
            onerror: (error) => console.log({ error }),
          },
        }}
      />
    </Flex>
  );
};
