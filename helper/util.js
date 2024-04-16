export function itMatchesOne(arr, term) {
  return arr.some((i) => term.search(i) >= 0);
}
export function parseAttrSelector(node) {
  const { content } = node;
   
  const regex = /(^class|^id)([*^?~|$=]*)+(?:("\s*)([^"\\]*?(?:\\.[^"\\]*)*?)(\s*")|('\s*)([^'\\]*?(?:\\.[^'\\]*)*?)(\s*'))/i;

  const [type, operator, head, classes, foot] = content
    .split(regex)
    .filter((part) => part);

  return {
    type,
    operator,
    head,
    classes: classes ? classes.split(' ').map((c) => c.replace(/"|'/g, '')) : [],
    foot,
  };
}
export function attrStringify({
  type, operator, head, classes, foot,
}) {
  return `${type}${operator || ''}${head || ''}${classes.join(' ')}${foot || ''}`;
}
