export function initState(hasTotals = false, hasErrors = false) {
  const payload = {
    isLoaded: false,
    isLoading: false,
    isLazyLoading: false,
    data: []
  };

  if (hasTotals) {
    payload.totals = {};
  }

  if (hasErrors) {
    payload.isError = false;
  }

  return payload;
}

export async function genericApiAction(
  action,
  { commit },
  payload,
  mutation,
  dataTransformation = data => data
) {
  const requestMutation = mutation;

  const mutationBase = mutation.replace('_REQUEST', '');

  const successMutation = `${mutationBase}_SUCCESS`;
  const failureMutation = `${mutationBase}_FAILURE`;

  commit(requestMutation);

  try {
    const { data, meta } = await action(payload);

    const result = { payload, meta, data: dataTransformation(data) };
    commit(successMutation, result);

    return result;
  } catch (errors) {
    commit(failureMutation, errors);

    throw errors;
  }
}
