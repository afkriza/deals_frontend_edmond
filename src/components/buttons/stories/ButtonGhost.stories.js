import ButtonGhost from '../ButtonGhost';
import { boolean, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'ButtonGhost',
  decorators: [withKnobs]
};

const template = `
  <ButtonGhost oval :dark="dark" >
    <template #icon>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.4142 4.41421L19.0607 4.76777L19.0607 4.76777L19.4142 4.41421ZM20.5858 5.58579L20.9393 5.23223L20.9393 5.23223L20.5858 5.58579ZM20.5858 8.41421L20.2322 8.06066L20.5858 8.41421ZM9 20V20.5H9.20711L9.35355 20.3536L9 20ZM5 20H4.5V20.5H5V20ZM5 16L4.64645 15.6464L4.5 15.7929V16H5ZM16.5858 4.41421L16.9393 4.76777L16.5858 4.41421ZM15.3536 5.64645C15.1583 5.45118 14.8417 5.45118 14.6464 5.64645C14.4512 5.84171 14.4512 6.15829 14.6464 6.35355L15.3536 5.64645ZM18.6464 10.3536C18.8417 10.5488 19.1583 10.5488 19.3536 10.3536C19.5488 10.1583 19.5488 9.84171 19.3536 9.64645L18.6464 10.3536ZM19.0607 4.76777L20.2322 5.93934L20.9393 5.23223L19.7678 4.06066L19.0607 4.76777ZM20.2322 5.93934C20.818 6.52513 20.818 7.47487 20.2322 8.06066L20.9393 8.76777C21.9157 7.79146 21.9157 6.20854 20.9393 5.23223L20.2322 5.93934ZM20.2322 8.06066L8.64645 19.6464L9.35355 20.3536L20.9393 8.76777L20.2322 8.06066ZM9 19.5H5V20.5H9V19.5ZM5.5 20V16H4.5V20H5.5ZM5.35355 16.3536L16.9393 4.76777L16.2322 4.06066L4.64645 15.6464L5.35355 16.3536ZM16.9393 4.76777C17.5251 4.18198 18.4749 4.18198 19.0607 4.76777L19.7678 4.06066C18.7915 3.08435 17.2085 3.08435 16.2322 4.06066L16.9393 4.76777ZM14.6464 6.35355L18.6464 10.3536L19.3536 9.64645L15.3536 5.64645L14.6464 6.35355Z" fill="currentColor"/>
      </svg>
    </template>
  </ButtonGhost>
`;

export const Default = () => ({
  template,
  components: { ButtonGhost },
  props: {
    dark: {
      default: () => boolean('Dark', false)
    }
  }
});
