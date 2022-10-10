export async function errorAdapter(res) {
  const json = await res.json();

  if (res.status === 422) {
    return json.errors.reduce((accumulator, error) => {
      accumulator[error.source.parameter] = error.detail;

      return accumulator;
    }, {});
  } else if (res.status === 403) {
    return json.errors;
  }

  return json;
}
