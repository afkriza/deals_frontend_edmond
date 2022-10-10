import Plus from '@/assets/images/icons/widget-operators/plus.svg';
import Minus from '@/assets/images/icons/widget-operators/minus.svg';
import Multiply from '@/assets/images/icons/widget-operators/multiply.svg';
import Divide from '@/assets/images/icons/widget-operators/divide.svg';
import Comma from '@/assets/images/icons/widget-operators/comma.svg';
import BracketsOpen from '@/assets/images/icons/widget-operators/brackets-open.svg';
import BracketsClose from '@/assets/images/icons/widget-operators/brackets-close.svg';
import Min from '@/assets/images/icons/widget-operators/min.svg';
import Max from '@/assets/images/icons/widget-operators/max.svg';
import Sum from '@/assets/images/icons/widget-operators/sum.svg';
import Avg from '@/assets/images/icons/widget-operators/avg.svg';
import Coalesce from '@/assets/images/icons/widget-operators/coalesce.svg';

import {
  PLUS,
  MINUS,
  MULTIPLY,
  DIVIDE,
  COMMA,
  BRACKETS_CLOSE,
  BRACKETS_OPEN,
  MIN,
  MAX,
  SUM,
  AVG,
  COALESCE
} from 'constants/widget-operators';

export default {
  components: {
    Plus,
    Minus,
    Multiply,
    Divide,
    Comma,
    BracketsOpen,
    BracketsClose,
    Min,
    Max,
    Sum,
    Avg,
    Coalesce
  },

  data() {
    return {
      operators: [
        PLUS,
        MINUS,
        MULTIPLY,
        DIVIDE,
        COMMA,
        BRACKETS_CLOSE,
        BRACKETS_OPEN,
        MIN,
        MAX,
        SUM,
        AVG,
        COALESCE
      ]
    };
  }
};
