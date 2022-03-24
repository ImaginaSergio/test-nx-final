import { Link } from 'react-router-dom';

import { Stack, Tooltip, Flex, Box } from '@chakra-ui/react';

import { Avatar } from '../../../UI';

import './RowTemplateText.scss';

interface textRowTemplateProps {
  content?: {
    text?: string;
    subtext?: string | null;
    link?: string;
    externalLink?: string;
    tooltip?: string;
    style?: React.CSSProperties;
    isDisabled?: boolean;
  };
  prefix?: { svg?: string; imagen?: string; content?: React.ReactNode };
  suffix?: {
    content?: React.ReactNode;
    badges?: {
      tooltip?: string;
      style?: React.CSSProperties;
      content: {
        text: string;
        style?: React.CSSProperties;
      };
    }[];
  };
}

const textRowTemplate = ({ content, prefix, suffix }: textRowTemplateProps) => {
  if (!content || !content.text)
    return (
      <Stack direction="row">
        <Box color="#A3A3B4">---</Box>
      </Stack>
    );

  let LinkWrapper = (props: any) =>
    content.link && !content.isDisabled ? (
      <Link to={content?.link || ''}>{props.children}</Link>
    ) : content.externalLink && !content.isDisabled ? (
      <a href={content?.externalLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
        {props.children}
      </a>
    ) : (
      props.children
    );

  let TooltipWrapper = (props: any) =>
    content.tooltip ? (
      <Tooltip aria-label="A tooltip" className="content-tooltip" label={content?.tooltip}>
        {props.children}
      </Tooltip>
    ) : (
      props.children
    );

  return (
    <LinkWrapper>
      <Stack direction="row">
        <Flex align="center" w="100%" gridGap="15px">
          {prefix?.svg ? (
            <img
              alt=""
              width="40px"
              height="40px"
              src={`data:image/svg+xml;utf8,${setColorTo(prefix?.svg)}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}
            />
          ) : (
            prefix?.svg === null && (
              <Box minH="40px" minW="40px" bg="transparent" border="2px dashed #3182FC" rounded="50%" mr="15px" />
            )
          )}

          {prefix?.imagen && <Avatar src={prefix.imagen} size="40px" name="NA" rounded="7px" />}

          {prefix?.content && <Box>{prefix.content}</Box>}

          <TooltipWrapper>
            <div className="content-text" style={content?.style} title={content?.text}>
              {content?.text}

              <Box color="#A3A3B4" fontWeight="medium">
                {content.subtext ? content.subtext : content.subtext === null && '---'}
              </Box>
            </div>
          </TooltipWrapper>

          {suffix?.content && <Box>{suffix.content}</Box>}
        </Flex>
      </Stack>
    </LinkWrapper>
  );
};

export { textRowTemplate };

const COLOR_REGEX = 'colorReplaceMe';

function setColorTo(elem: any, color: string = '%233182FC') {
  return elem?.replaceAll(COLOR_REGEX, color);
}
