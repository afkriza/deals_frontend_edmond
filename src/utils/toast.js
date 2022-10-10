export function toastFactory(message, type, abortable = false) {
  return { message, type, abortable };
}
