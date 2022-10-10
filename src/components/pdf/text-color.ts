import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

type TextColorOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textColor: {
      setTextColor: (textColor: string) => ReturnType;
      unsetTextColor: () => ReturnType;
    };
  }
}

export const TextColor = Extension.create<TextColorOptions>({
  name: 'textColor',

  defaultOptions: {
    types: ['textStyle']
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textColor: {
            default: null,
            renderHTML: attributes => {
              if (!attributes.textColor) {
                return;
              }

              return {
                style: `color: ${attributes.textColor}`
              };
            },
            parseHTML: element => element.style.color.replace(/['"]+/g, '')
          }
        }
      }
    ];
  },

  addCommands() {
    return {
      setTextColor:
        textColor =>
        ({ chain }) => {
          return chain().setMark('textStyle', { textColor }).run();
        },
      unsetTextColor:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { textColor: null })
            .removeEmptyTextStyle()
            .run();
        }
    };
  }
});
