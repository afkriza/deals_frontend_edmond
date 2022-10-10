import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

type TextTransformOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textTransform: {
      setTextTransform: (textTransform: string) => ReturnType;
      unsetTextTransform: () => ReturnType;
    };
  }
}

export const TextTransform = Extension.create<TextTransformOptions>({
  name: 'textTransform',

  defaultOptions: {
    types: ['textStyle']
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textTransform: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.textTransform) {
                return;
              }

              return {
                style: `text-transform: ${attributes.textTransform}`
              };
            },
            parseHTML: element =>
              element.style.textTransform.replace(/['"]+/g, '')
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setTextTransform:
        textTransform =>
        ({ chain }) => {
          return chain().setMark('textStyle', { textTransform }).run();
        },
      unsetTextTransform:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { textTransform: null })
            .removeEmptyTextStyle()
            .run();
        }
    };
  }
});
