export const getCssValues = (cssVariables: string[]) => {
  const style = getComputedStyle(document.documentElement);
  const values = [];

  for (const variable of cssVariables) {
    let value = style.getPropertyValue(variable).trim();
    if (!value) {
      console.warn(
        `CSS variable ${variable} not found. Resort to brown color(not suitable for the project color palette).`
      );
      value = '#513531';
    }
    values.push(value);
  }
  return values;
};
