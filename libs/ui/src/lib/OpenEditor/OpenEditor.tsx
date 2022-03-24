import { useEffect, useState } from 'react';

import { Flex } from '@chakra-ui/react';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';

import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowLight from '@tiptap/extension-code-block-lowlight';
import CodeBlockComponent from './TipTapSyntaxisHighlighter/CodeBlockComponent';

import { lowlight } from 'lowlight/lib/core';

import { EditorMenu } from './EditorMenu';

import './OpenEditor.scss';
import './CodeStyles.scss';

interface OpenEditorProps {
  placeholder?: string;
  value: string;
  onChange: (e: any) => void;
  isDisabled?: boolean;
}

export const OpenEditor = ({ placeholder, value, isDisabled, onChange }: OpenEditorProps) => {
  const editor = useEditor({
    content: value || '',
    onBlur: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    extensions: [
      StarterKit,
      Link,
      Image.configure({
        inline: true,
      }),
      Placeholder.configure({ placeholder: placeholder }),

      CodeBlockLowLight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
  });

  useEffect(() => {
    editor?.commands.setContent(value, false);
  }, [value]);

  return (
    <Flex w="100%" border="1px solid var(--chakra-colors-gray_3)" rounded="xl" direction="column" minH="195" bg="white">
      <EditorMenu editor={editor} isDisabled={isDisabled} />

      <Flex p="12px" h="100%" w="100%">
        <div style={{ width: '100%' }}>
          <EditorContent editor={editor} disabled={isDisabled} />
        </div>
      </Flex>
    </Flex>
  );
};
