import PinnedFilterDropdownContent from '../PinnedFilterDropdownContent';

export default {
  title: 'Filters/Pinned Filters/Dropdown Content'
};

const template = `
<pinned-filter-dropdown-content>
Filter Content
</pinned-filter-dropdown-content>
`;

export const Default = () => ({
  template,
  components: { PinnedFilterDropdownContent }
});
