import { CSSHelper, ColorFormat, NamingHelper, StringCase } from '@supernovaio/export-helpers';
import {
  LetterSpacingTokenValue,
  Token,
  TokenGroup,
  TokenType,
  TypographyToken,
  TypographyTokenValue,
} from '@supernovaio/sdk-exporters';
import { createTokenName } from './create-token-name';

/**
 * Create typography mixin consisting of CSS props font, letter-spacing & text-indent.
 * @param token
 * @param tokenGroups
 * @param mappedTokens
 * @param colorFormat
 * @returns string
 */
export function createTypographyMixin(
  token: TypographyToken,
  tokenGroups: TokenGroup[],
  mappedTokens: Map<string, Token>,
  colorFormat: ColorFormat
): string {
  const typographyTokens = token.value;
  const genericFontFamilyFallback = ', -apple-system, BlinkMacSystemFont, arial, sans-serif';

  if (typographyTokens.fontFamily.text === 'Inter' || typographyTokens.fontFamily.text === 'Roobert') {
    typographyTokens.fontFamily.text = typographyTokens.fontFamily.text + genericFontFamilyFallback;
  }

  const parent = tokenGroups.find((group) => group.id === token.parentGroupId)!;
  const mixinName = NamingHelper.codeSafeVariableNameForToken(
    token,
    StringCase.paramCase,
    parent,
    TokenType.typography
  );

  const fontContent = createFontShorthand(typographyTokens, tokenGroups, mappedTokens, colorFormat);
  const letterSpacingContent = typographyTokens.letterSpacing.measure
    ? createLetterSpacing(typographyTokens.letterSpacing, tokenGroups, mappedTokens, colorFormat)
    : null;

  const mixinContent = letterSpacingContent ? fontContent + letterSpacingContent : fontContent;

  return `@mixin ${mixinName} {${mixinContent}\n}`;
}

/**
 * Create font shorthand value.
 * Font shorthand order (style & variant not supported yet):
 * (style) (variant) weight font-size/line-height font-family
 * @returns string
 */
function createFontShorthand(
  fontSubtokens: TypographyTokenValue,
  tokenGroups: TokenGroup[],
  mappedTokens: Map<string, Token>,
  colorFormat: ColorFormat
): string {
  // check if fontWeight is a string or number (e.g. bold vs 300)
  const fontWeight = /^\d+$/.test(fontSubtokens.fontWeight.text)
    ? Number(fontSubtokens.fontWeight.text)
    : fontSubtokens.fontWeight.text;
  const fontSize = CSSHelper.dimensionTokenValueToCSS(fontSubtokens.fontSize, mappedTokens, {
    allowReferences: true,
    decimals: 2,
    colorFormat: colorFormat,
    tokenToVariableRef: (t) => createTokenName(t, TokenType.typography, tokenGroups),
  });
  const fontLineHeight = fontSubtokens.lineHeight
    ? CSSHelper.dimensionTokenValueToCSS(fontSubtokens.lineHeight, mappedTokens, {
        allowReferences: true,
        decimals: 2,
        colorFormat: colorFormat,
        tokenToVariableRef: (t) => createTokenName(t, TokenType.typography, tokenGroups),
      })
    : null;
  const fontFamily = fontSubtokens.fontFamily.text;

  return `\n  font: ${fontWeight} ${fontSize}/${fontLineHeight} ${fontFamily};`;
}

/**
 * Create letter-spacing value
 * @param fontSubtokens
 * @param tokenGroups
 * @param mappedTokens
 * @returns string
 */
function createLetterSpacing(
  token: LetterSpacingTokenValue,
  tokenGroups: TokenGroup[],
  mappedTokens: Map<string, Token>,
  colorFormat: ColorFormat
): string {
  const letterSpacingValue = CSSHelper.dimensionTokenValueToCSS(token, mappedTokens, {
    allowReferences: true,
    decimals: 2,
    colorFormat: colorFormat,
    tokenToVariableRef: (t) => createTokenName(t, TokenType.typography, tokenGroups),
  });

  return `\n  letter-spacing: ${letterSpacingValue};`;
}
