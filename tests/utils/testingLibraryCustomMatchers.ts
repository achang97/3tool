import { MatcherFunction } from '@testing-library/react';

/**
 * Getting the deepest element that contain string / match regex even when it split between multiple elements
 *
 * @example
 * For:
 * <div>
 *   <span>Hello</span><span> World</span>
 * </div>
 *
 * screen.getByText('Hello World') // ❌ Fail
 * screen.getByText(textContentMatcher('Hello World')) // ✅ pass
 *
 * See link for more info - https://github.com/testing-library/dom-testing-library/issues/410#issuecomment-1060917305
 */
export const textContentMatcher = (textMatch: RegExp | number | string): MatcherFunction => {
  const hasText = (node: Element) =>
    textMatch instanceof RegExp
      ? textMatch.test(node.textContent ?? '')
      : node.textContent === textMatch;

  return (_content, node) => {
    if (!node || !hasText(node)) {
      return false;
    }

    const childrenDontHaveText = Array.from(node?.children ?? []).every((child) => !hasText(child));

    return childrenDontHaveText;
  };
};
