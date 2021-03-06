import { useState, useEffect } from 'react';

import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { BiClipboard } from 'react-icons/bi';
import { Spinner, Icon, useToast, Flex } from '@chakra-ui/react';
import { AiOutlineFileSync, AiOutlineCloudSync } from 'react-icons/ai';

import { onFailure, onSuccess } from '@clevery-lms/utils';

import 'react-mde/lib/styles/css/react-mde-all.css';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  copy?: boolean;
  dataToSync?: any;
  defaultValue?: string;
  isDisabled?: boolean;
  style?: React.CSSProperties;
  updateValue: (e?: any) => void | any;
};

export const InformationMde = ({
  name,
  label,
  defaultValue = '',
  updateValue,
  placeholder,
  isDisabled,
  copy = false,
  style,
  dataToSync,
}: Props) => {
  const toast = useToast();

  const [value, setValue] = useState<string>(defaultValue);
  const [valueToSync, setValueToSync] = useState<string>(dataToSync || '');
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>(
    'preview'
  );

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    setValueToSync(dataToSync);
  }, [dataToSync]);

  const onChange = (e: string) => {
    if (update === 'idle') setUpdate('editing');

    setValue(e);
  };

  const onUpdate = (e: any) => {
    setUpdate('loading');

    updateValue({ [name]: e }).then((res: any) => {
      setUpdate('idle');
    });
  };

  const onBlur = (e: any) => {
    setUpdate('loading');

    updateValue({ [name]: e.target.value }).then((res: any) => {
      setUpdate('idle');
      setSelectedTab('preview');
    });
  };

  const syncData = () => {
    if (value) {
      onFailure(
        toast,
        'Error al sincronizar',
        '¡Borra toda la información actual para sincronizar!'
      );
    } else {
      setUpdate('loading');
      setValue(valueToSync);

      updateValue({ [name]: valueToSync }).then((res: any) => {
        setUpdate('idle');
        setSelectedTab('preview');
      });
    }
  };

  return (
    <Flex direction="column" fontSize="14px" style={style}>
      <label className="information-block-label">
        {label}

        {update !== 'loading' ? (
          <Icon
            as={AiOutlineCloudSync}
            ml="2"
            size="xs"
            onClick={() => onUpdate(value)}
            color={value === defaultValue ? 'gray_5' : 'primary'}
          />
        ) : (
          <Spinner ml="2" size="xs" />
        )}

        {copy && value && update === 'idle' && (
          <Icon
            as={BiClipboard}
            title="Pulsa para copiar"
            className="clipboard-button"
            data-clipboard-text={value}
            onClick={() => onSuccess(toast, 'Texto copiado')}
          />
        )}

        {valueToSync && (
          <Icon
            as={AiOutlineFileSync}
            ml="8px"
            boxSize="22px"
            cursor="pointer"
            onClick={syncData}
            title="Pulsa para sincronizar la información"
          />
        )}
      </label>

      <ReactMde
        value={value}
        onChange={onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(<ReactMarkdown children={markdown || ''} />)
        }
        childProps={{
          previewButton: { style: buttonStyle(selectedTab === 'write') },
          writeButton: {
            tabIndex: -1,
            style: buttonStyle(selectedTab === 'preview'),
          },
          textArea: {
            onBlur: onBlur,
            disabled: isDisabled || update === 'loading',
            placeholder: placeholder,
          },
        }}
        toolbarCommands={[
          ['header', 'bold', 'italic', 'strikethrough'],
          ['link', 'unordered-list', 'ordered-list'],
        ]}
      />
    </Flex>
  );
};

const buttonStyle = (show: boolean): React.CSSProperties => {
  return {
    background: '#3182FC',
    borderRadius: '7px',
    color: 'white',
    fontWeight: 600,
    padding: '4px 8px',
    display: show ? 'block' : 'none',
  };
};
