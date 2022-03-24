import { Stack, Tooltip, Flex, Box, Progress } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import './RowTemplateProgress.scss';

interface progressRowTemplateProps {
  content?: {
    label?: string;
    value?: number;
  };
}

const progressRowTemplate = ({ content }: progressRowTemplateProps) => {
  if (!content)
    return (
      <Stack direction="row">
        <Box color="#A3A3B4">---</Box>
      </Stack>
    );

  return (
    <Stack direction="row">
      <Flex w="100%" direction="column" gridGap="7px">
        <Box fontWeight="semibold" fontSize="13px" lineHeight="10px" color="#12BE94">
          {content?.label}
        </Box>

        <Progress
          w="100%"
          h="10px"
          rounded="58px"
          value={100}
          sx={{
            '& > div': {
              background: !content?.value
                ? 'white'
                : `linear-gradient(90deg, #25CBAB 0%, #0FFFA9 ${content?.value + '%'}, #E6E8EE ${
                    content?.value + '%'
                  }, #E6E8EE 100%)`,
            },
          }}
        />
      </Flex>
    </Stack>
  );
};

export { progressRowTemplate };

const COLOR_REGEX = 'colorReplaceMe';

function setColorTo(elem: any, color: string = '%233182FC') {
  return elem?.replaceAll(COLOR_REGEX, color);
}
