import FileSaver from 'file-saver';

export function saveAs(name, blob) {
  return FileSaver.saveAs(blob, name);
}
