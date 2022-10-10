import Variable from './Variable';
import VariableInstance from './VariableInstance';
import Operator from './Operator';
import OperatorInstance from './OperatorInstance';
import Category from './Category';
import CategoryInstance from './CategoryInstance';

export default function instantiate(model, args) {
  if (model instanceof Variable) {
    return VariableInstance.from({ ...model, ...args });
  } else if (model instanceof Operator) {
    return OperatorInstance.from({ ...model, ...args });
  } else if (model instanceof Category) {
    return CategoryInstance.from({ ...model, ...args });
  }

  return model;
}
