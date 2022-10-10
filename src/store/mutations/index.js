import style from 'store/mutations/style';
import session from 'store/mutations/session';
import user from 'store/mutations/user';
import passwordResetRequest from 'store/mutations/password-reset-request';
import toast from 'store/mutations/toast';
import filters from 'store/mutations/filters';

export default {
  ...style,
  ...session,
  ...user,
  ...passwordResetRequest,
  ...toast,
  ...filters
};
