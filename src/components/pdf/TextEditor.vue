<template>
  <div :class="$style.wrapper">
    <EditorContent :class="$style.editor" :editor="editor" />
    <div v-if="editor" :class="$style.buttonsContainer">
      <div :class="$style.buttonGroupContainer">
        <Button
          :class="[
            $style.formatButton,
            { [$style.isActive]: editor.isActive('bold') }
          ]"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <BoldIcon :class="$style.icon" />
        </Button>
        <Button
          :class="[
            $style.formatButton,
            { [$style.isActive]: editor.isActive('strike') }
          ]"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <StrikeThroughIcon :class="$style.icon" />
        </Button>
        <Button
          :class="[
            $style.formatButton,
            { [$style.isActive]: editor.isActive('italic') }
          ]"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <ItalicIcon :class="$style.icon" />
        </Button>
      </div>
      <div :class="$style.buttonGroupContainer">
        <TextStylePicker @update="updateTextStyle">
          <Button :class="$style.formatButton">
            <TextStyleIcon :class="$style.icon" />
          </Button>
        </TextStylePicker>
        <Button
          :class="[
            $style.formatButton,
            { [$style.isActive]: editor.isActive('bulletList') }
          ]"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <ListBulletedIcon :class="$style.icon" />
        </Button>
        <Button
          :class="[
            $style.formatButton,
            { [$style.isActive]: editor.isActive('orderedList') }
          ]"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <ListNumberedIcon :class="$style.icon" />
        </Button>
      </div>
      <div :class="$style.buttonGroupContainer">
        <Button
          :class="[
            $style.formatButton,
            { [$style.isActive]: editor.isActive({ textAlign: 'left' }) }
          ]"
          @click="editor.chain().focus().setTextAlign('left').run()"
        >
          <AlignLeftIcon :class="$style.icon" />
        </Button>
        <Button
          :class="[
            $style.formatButton,
            { [$style.isActive]: editor.isActive({ textAlign: 'center' }) }
          ]"
          @click="editor.chain().focus().setTextAlign('center').run()"
        >
          <AlignCenterIcon :class="$style.icon" />
        </Button>
        <Button
          :class="[
            $style.formatButton,
            { [$style.isActive]: editor.isActive({ textAlign: 'right' }) }
          ]"
          @click="editor.chain().focus().setTextAlign('right').run()"
        >
          <AlignRightIcon :class="$style.icon" />
        </Button>
        <Button
          :class="[
            $style.formatButton,
            { [$style.isActive]: editor.isActive({ textAlign: 'justify' }) }
          ]"
          @click="editor.chain().focus().setTextAlign('justify').run()"
        >
          <AlignJustifyIcon :class="$style.icon" />
        </Button>
      </div>
      <div :class="$style.buttonGroupContainer">
        <TextColorPicker :value="selectedTextColor" @update="updateTextColor">
          <Button :class="$style.formatButton">
            <ColorFillIcon :class="$style.icon" :color="selectedTextColor" />
          </Button>
        </TextColorPicker>
        <label :class="$style.formatButton">
          <input
            type="file"
            :class="$style.hiddenImageUpload"
            accept="image/*"
            @change="addImage"
          />
          <ImageIcon :class="$style.icon" />
        </label>
      </div>
      <VPopover
        :open.sync="isPresetDropdownOpen"
        :class="$style.popover"
        :auto-hide="!isPresetModalOpen"
        placement="bottom-end"
        offset="6"
        :disabled="arePresetsDisabled"
      >
        <ButtonGhost
          v-if="showPresets"
          :class="$style.buttonPresets"
          text="Presets"
          :disabled="arePresetsDisabled"
        />

        <template #popover>
          <div :class="$style.dropdown">
            <template v-if="arePresetsEmpty">
              <p>
                <span :class="$style.textSave">Save</span> current text as a
                preset for future use
              </p>
              <LongArrowDown :class="$style.arrow" />
            </template>
            <template v-else>
              <DropdownList
                :items="presets"
                :custom-item-class="$style.preset"
                @select="onPresetSelect"
              >
                <template #item="{ item }">
                  <TextEllipsis :text="item.name" />
                  <ButtonGhost
                    oval
                    @click="onEditPresetClick(item)"
                    @mousedown.stop
                  >
                    <template #icon>
                      <IconEdit />
                    </template>
                  </ButtonGhost>
                  <ButtonGhost
                    oval
                    destructive
                    @click="onDeletePresetClick(item)"
                    @mousedown.stop
                  >
                    <template #icon>
                      <IconDelete />
                    </template>
                  </ButtonGhost>
                </template>
              </DropdownList>
            </template>
            <Button
              :class="$style.buttonCreateNewPreset"
              @click="onCreateNewPresetClick"
            >
              <IconAddFlat />
              <span> Create new preset </span>
            </Button>
          </div>
        </template>
      </VPopover>
    </div>
    <PresetModal
      v-if="isCreateNewPresetModalOpen"
      title="Create new preset"
      submit-button-text="Create"
      :preset="activePreset"
      :submit="createPreset"
      @close="closeModal('isCreateNewPresetModalOpen')"
    />
    <PresetModal
      v-if="isEditPresetModalOpen"
      title="Rename preset"
      submit-button-text="Save"
      :preset="activePreset"
      :submit="editPreset"
      @close="closeModal('isEditPresetModalOpen')"
    />
    <PresetModal
      v-if="isDeletePresetModalOpen"
      title="Delete preset"
      submit-button-text="Delete"
      destructive
      :preset="activePreset"
      :submit="deletePreset"
      @close="closeModal('isDeletePresetModalOpen')"
    />
  </div>
</template>

<script>
  import { find, get, isEmpty, size } from 'lodash';
  import { required } from 'vuelidate/lib/validators';

  import { Editor, EditorContent } from '@tiptap/vue-2';
  import StarterKit from '@tiptap/starter-kit';
  import TextAlign from '@tiptap/extension-text-align';
  import Image from '@tiptap/extension-image';
  import Dropcursor from '@tiptap/extension-dropcursor';
  import Gapcursor from '@tiptap/extension-gapcursor';
  import TextStyle from '@tiptap/extension-text-style';

  import { VPopover } from 'v-tooltip';

  import IconAddFlat from '@/assets/images/icons/add-flat.svg';

  import LongArrowDown from '@/assets/images/icons/long-arrow-down.svg';

  import BoldIcon from '@/assets/images/icons/text-editor/format_bold-24px.svg';
  import StrikeThroughIcon from '@/assets/images/icons/text-editor/strikethrough_s-24px.svg';
  import ItalicIcon from '@/assets/images/icons/text-editor/format_italic-24px.svg';

  import TextStyleIcon from '@/assets/images/icons/text-editor/format_size-24px.svg';
  import ListBulletedIcon from '@/assets/images/icons/text-editor/format_list_bulleted-24px.svg';
  import ListNumberedIcon from '@/assets/images/icons/text-editor/format_list_numbered-24px.svg';

  import AlignLeftIcon from '@/assets/images/icons/text-editor/format_align_left-24px.svg';
  import AlignCenterIcon from '@/assets/images/icons/text-editor/format_align_center-24px.svg';
  import AlignRightIcon from '@/assets/images/icons/text-editor/format_align_right-24px.svg';
  import AlignJustifyIcon from '@/assets/images/icons/text-editor/format_align_justify-24px.svg';

  import ColorFillIcon from '@/assets/images/icons/text-editor/format_color_fill-24px.svg';
  import ImageIcon from '@/assets/images/icons/text-editor/image_24px.svg';

  import editorTextColors from '@/enums/editor-text-colors';

  import TextStylePicker from '@/components/app/TextStylePicker';
  import { FontSize } from './font-size';
  import { TextTransform } from './text-transform';
  import { TEXT_STYLES } from '@/constants/text-styles';

  import TextColorPicker from '@/components/app/TextColorPicker';
  import { TextColor } from './text-color';
  import ButtonGhost from '@/components/buttons/ButtonGhost';
  import Button from '@/components/core/Button';
  import { modalSizesEnum } from '@/enums/modal-sizes';
  import DropdownList from '@/components/core/DropdownList';

  import IconEdit from '@/assets/images/icons/Analytics/edit.svg';
  import IconDelete from '@/assets/images/icons/Misc/ic-24-delete.svg';
  import PresetModal from '@/components/groups/PresetModal';
  import { Preset } from '@/models/groups/Preset.model';
  import TextEllipsis from '@/components/core/TextEllipsis';

  export default {
    name: 'TextEditor',
    components: {
      TextEllipsis,
      PresetModal,
      DropdownList,
      Button,
      ButtonGhost,
      EditorContent,
      BoldIcon,
      StrikeThroughIcon,
      ItalicIcon,
      TextStyleIcon,
      ListBulletedIcon,
      ListNumberedIcon,
      AlignLeftIcon,
      AlignCenterIcon,
      AlignRightIcon,
      AlignJustifyIcon,
      ColorFillIcon,
      ImageIcon,
      TextStylePicker,
      TextColorPicker,
      VPopover,
      IconAddFlat,
      LongArrowDown,
      IconEdit,
      IconDelete
    },

    model: {
      prop: 'modelValue',
      event: 'update:modelValue'
    },

    validations: {
      presetName: {
        required
      }
    },

    props: {
      modelValue: {
        type: String,
        default: ''
      },

      presets: {
        type: Array,
        default: null
      },
      createPreset: {
        type: Function,
        default: () => ({})
      },
      editPreset: {
        type: Function,
        default: () => ({})
      },
      deletePreset: {
        type: Function,
        default: () => ({})
      }
    },

    data() {
      return {
        editor: null,
        editorTextColors,
        isCreateNewPresetModalOpen: false,
        isEditPresetModalOpen: false,
        isDeletePresetModalOpen: false,
        isPresetDropdownOpen: false,
        presetName: '',
        activePreset: null
      };
    },

    computed: {
      isPresetModalOpen() {
        return (
          this.isCreateNewPresetModalOpen ||
          this.isEditPresetModalOpen ||
          this.isDeletePresetModalOpen
        );
      },

      modalSizesEnum() {
        return modalSizesEnum;
      },

      showPresets() {
        return Boolean(this.presets);
      },

      numberOfPresets() {
        return size(this.presets);
      },

      arePresetsEmpty() {
        return isEmpty(this.presets);
      },

      arePresetsDisabled() {
        return (
          (isEmpty(this.modelValue) || this.modelValue === '<p></p>') &&
          this.arePresetsEmpty
        );
      },

      content: {
        get() {
          return this.value;
        },

        set(newContent) {
          this.$emit('update', newContent);
        }
      },

      selectedTextColor() {
        return (
          this.editor.getAttributes('textStyle').textColor ||
          get(
            find(editorTextColors, ({ value }) =>
              this.editor.isActive({ textColor: value })
            ),
            'value',
            null
          )
        );
      }
    },

    watch: {
      modelValue(value) {
        // HTML
        const isSame = this.editor.getHTML() === value;

        // JSON
        // const isSame = this.editor.getJSON().toString() === value.toString()

        if (isSame) {
          return;
        }

        this.editor.commands.setContent(value, false);
      }
    },

    mounted() {
      this.editor = new Editor({
        content: this.modelValue,
        onUpdate: () => {
          // HTML
          this.$emit('update:modelValue', this.editor.getHTML());

          // JSON
          // this.$emit('update:modelValue', this.editor.getJSON())
        },
        extensions: [
          StarterKit,
          TextAlign.configure({
            types: ['paragraph']
          }),
          Image,
          Dropcursor,
          Gapcursor,
          TextStyle,
          FontSize,
          TextTransform,
          TextColor
        ],
        editorProps: {
          attributes: {
            class: 'editor'
          }
        }
      });
    },

    beforeDestroy() {
      this.editor.destroy();
    },

    methods: {
      closeModal(modalName) {
        // hacky way to keep presets dropdown open after user closes/submits a modal
        setTimeout(() => {
          this[modalName] = false;
        }, 0);
      },

      onCreateNewPresetClick() {
        this.activePreset = new Preset({
          id: null,
          scope: null,
          content: this.modelValue,
          name: ''
        });

        this.isCreateNewPresetModalOpen = true;
      },

      onEditPresetClick(preset) {
        this.activePreset = preset;

        this.isEditPresetModalOpen = true;
      },

      onDeletePresetClick(preset) {
        this.activePreset = preset;

        this.isDeletePresetModalOpen = true;
      },

      onPresetSelect(preset) {
        this.isPresetDropdownOpen = false;

        this.$emit('update:modelValue', preset.content);
      },

      addImage(event) {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.editor
            .chain()
            .focus()
            .setImage({
              src: reader.result
            })
            .run();
        };
        reader.readAsDataURL(event.target.files[0]);
      },

      updateTextStyle(textStyle) {
        this.editor
          .chain()
          .focus()
          .setFontSize(`${TEXT_STYLES[textStyle].size}`)
          .run();

        this.editor
          .chain()
          .focus()
          .setTextTransform(`${TEXT_STYLES[textStyle].textTransform}`)
          .run();
      },

      updateTextColor(textColor) {
        this.editor.chain().focus().setTextColor(`${textColor}`).run();
      }
    }
  };
</script>

<style lang="scss" module>
  @import 'utils';

  .editor :global(.ProseMirror) {
    padding: 16px;

    border: 1px solid $color-border-main-light;
    border-radius: 4px 4px 0 0;
    font-family: 'Lato', sans-serif;

    min-height: 52px;

    outline: none;

    p {
      margin: 0;
    }

    img {
      display: block;
      max-width: 100%;
    }

    ul {
      margin: 0;
      padding-left: 28px;
    }

    &:focus {
      padding: 15px;
      border: 2px solid #2367ba;
    }

    &:hover {
      @include hard-shadow($color-border-primary-light, 3px);
    }
  }

  .format-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    border: none;
    border-radius: 4px;
    background-color: $color-bg-light;
    color: $color-text-main;
    margin-right: 4px;

    cursor: pointer;

    &:hover,
    &.is-active {
      color: $color-text-primary-highlight;
      background-color: $color-bg-primary-dimmed;
    }
  }

  .buttons-container {
    display: flex;
    border: 1px solid $color-border-main-light;
    border-radius: 0 0 4px 4px;
    border-top: none;
    padding: 0 4px;
  }

  .button-group-container {
    display: flex;
    width: fit-content;
    padding: 4px 8px;

    &:not(:last-child) {
      border-right: 1px solid $color-border-main-light;
    }
  }

  .icon {
    vertical-align: middle;
  }

  .hidden-image-upload {
    display: none;
  }

  .popover {
    align-self: center;

    margin-left: auto;
    margin-right: 8px;
  }

  .button-presets {
    text-transform: uppercase;

    padding: 6px 8px;
  }

  .dropdown {
    @include column;
    background-color: $color-bg-light;

    width: 258px;

    padding-top: 8px;

    & > p {
      margin: 8px 24px 16px;
      text-align: center;
    }
  }

  .button-create-new-preset {
    @include button;
    @include row;
    align-items: center;

    color: $color-text-primary;

    padding: 10px 16px;

    text-transform: none;
    font-weight: normal;

    &:hover,
    &:focus {
      background-color: $color-bg-primary-dimmed;
    }

    & > * + * {
      margin-left: 12px;
    }
  }

  .text-save,
  .arrow {
    color: $color-text-primary;
  }

  .arrow {
    align-self: center;

    margin-bottom: 16px;
  }

  .preset {
    height: 48px;

    > span {
      margin-right: auto;
    }
  }
</style>
