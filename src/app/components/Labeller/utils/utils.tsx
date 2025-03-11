export const aIsChildOfB = (a: Node | null, b: Node | null) => {
  return b?.contains(a);
};
