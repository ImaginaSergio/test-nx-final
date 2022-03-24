import React from 'react';

import { Box, Image, Button, IconButton, Flex } from '@chakra-ui/react';

import './PageHeader.scss';

type PageHeaderProps = {
  head: {
    title: string;
    subtitle?: string | React.ReactNode;
    image?: string;
    onClick?: () => void;
  };

  button?: {
    text: string;
    leftIcon?: any;
    disabled?: boolean;
    onClick: () => void;
  };

  buttonGroup?: {
    text: string;
    leftIcon?: any;
    disabled?: boolean;
    onClick: () => void;
  }[];

  iconButtons?: {
    icon?: any;
    disabled?: boolean;
    onClick: () => void;
  }[];
};

const PageHeader = ({ head, button, iconButtons, buttonGroup }: PageHeaderProps) => {
  return (
    <div className="page-header">
      <div className="page-header--head">
        {head.image && <Image fit="cover" objectPosition="center" minW="45px" h="45px" rounded="7px" src={head.image} />}

        <Flex direction="column" gridGap="8px" width="100%">
          <Box className={`page-header--head--title`} onClick={head.onClick}>
            {head.title}
          </Box>

          {head.subtitle && (
            <Box color="gray_3" fontSize="14px" lineHeight="16px" fontWeight="medium">
              {head.subtitle}
            </Box>
          )}
        </Flex>
      </div>

      <Flex minW="fit-content" align="center" gridGap="12px">
        {iconButtons?.map((i, index) => (
          <IconButton
            key={`pageheader-iconbutton-${index}`}
            aria-label="boton"
            rounded="12px"
            icon={i.icon}
            onClick={i.onClick}
            isDisabled={i.disabled}
          />
        ))}

        {button && (
          <Button
            bg="#ffffff"
            rounded="12px"
            border="2px solid #E6E8EE"
            onClick={button?.onClick}
            leftIcon={button?.leftIcon}
            isDisabled={button?.disabled}
          >
            {button?.text}
          </Button>
        )}

        {buttonGroup &&
          buttonGroup?.map((i, index) => (
            <Button
              bg="#ffffff"
              rounded="12px"
              border="2px solid #E6E8EE"
              onClick={i?.onClick}
              leftIcon={i?.leftIcon}
              isDisabled={i?.disabled}
            >
              {i?.text}
            </Button>
          ))}
      </Flex>
    </div>
  );
};

export { PageHeader };
