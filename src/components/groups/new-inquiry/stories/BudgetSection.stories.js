import BudgetSection from '../BudgetSection';

export default {
  title: 'Groups/NewInquiry/BudgetSection'
};

const template = `
  <BudgetSection :budget.sync="budget" :ancillary.sync="ancillary" />
`;

export const Default = () => ({
  template,
  components: { BudgetSection },
  data() {
    return {
      budget: null,
      ancillary: null
    };
  }
});
