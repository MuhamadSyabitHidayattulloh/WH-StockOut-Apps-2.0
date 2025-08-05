export const readFormatQRLocation = code => {
  const bunit = code.slice(2, 6);
  const line = code.slice(6, 16);
  const pos = code.slice(17, 26);
  const partNumber = code.slice(28, 41);

  const result = {
    bunit: bunit,
    line: line,
    pos: pos,
    partNumber: partNumber,
  };
  return result;
};
