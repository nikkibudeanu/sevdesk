import { CSSHelper, ColorFormat } from '@supernovaio/export-helpers';
import {
  BlurToken,
  BorderToken,
  ColorToken,
  DimensionToken,
  GradientToken,
  ShadowToken,
  SizeToken,
  StringToken,
  Token,
  TokenGroup,
  TokenType,
  TypographyToken,
} from '@supernovaio/sdk-exporters';
import { createTypographyMixin } from './create-typography-mixin';
import { createTokenName } from './create-token-name';

export function createStylesContent(
  tokens: Token[],
  tokenType: TokenType,
  mappedTokens: Map<string, Token>,
  tokenGroups: Array<TokenGroup>,
  colorFormat: ColorFormat
): string {
  return tokens
    .map((token) => tokenToSCSS(token, tokenType, mappedTokens, tokenGroups, colorFormat))
    .sort(alphabeticalWithReferencesComparator)
    .join('\n');
}

function tokenToSCSS(
  token: Token,
  tokenType: TokenType,
  mappedTokens: Map<string, Token>,
  tokenGroups: TokenGroup[],
  colorFormat: ColorFormat
): string {
  // First creating the name of the token, using helper function which turns any token name / path into a valid variable name
  const name = createTokenName(token, tokenType, tokenGroups);

  // Then creating the value of the token, using another helper function
  let value;
  switch (tokenType) {
    case TokenType.blur:
      value = CSSHelper.blurTokenValueToCSS((token as BlurToken).value, mappedTokens, {
        allowReferences: true,
        decimals: 2,
        colorFormat: colorFormat,
        tokenToVariableRef: (t) => createTokenName(t, tokenType, tokenGroups),
      });
      break;
    case TokenType.border:
      value = CSSHelper.borderTokenValueToCSS((token as BorderToken).value, mappedTokens, {
        allowReferences: true,
        decimals: 2,
        colorFormat: colorFormat,
        tokenToVariableRef: (t) => createTokenName(t, tokenType, tokenGroups),
      });
      break;
    case TokenType.color:
      value = CSSHelper.colorTokenValueToCSS((token as ColorToken).value, mappedTokens, {
        allowReferences: true,
        decimals: 2,
        colorFormat: colorFormat,
        tokenToVariableRef: (t) => createTokenName(t, tokenType, tokenGroups),
      });
      break;
    case TokenType.dimension:
    case TokenType.letterSpacing:
    case TokenType.lineHeight:
    case TokenType.fontSize:
      value = CSSHelper.dimensionTokenValueToCSS((token as DimensionToken).value, mappedTokens, {
        allowReferences: true,
        decimals: 2,
        colorFormat: colorFormat,
        tokenToVariableRef: (t) => createTokenName(t, tokenType, tokenGroups),
      });
      break;
    case TokenType.typography:
      return createTypographyMixin(token as TypographyToken, tokenGroups, mappedTokens, colorFormat);

    case TokenType.gradient:
      // Issue whith deg value always 0
      value = CSSHelper.gradientTokenValueToCSS((token as GradientToken).value, mappedTokens, {
        allowReferences: true,
        decimals: 2,
        colorFormat: colorFormat,
        tokenToVariableRef: (t) => createTokenName(t, tokenType, tokenGroups),
      });
      break;
    case TokenType.shadow: {
      (token as ShadowToken).value[0].color.opacity = (token as ShadowToken).value[0].opacity;

      value = CSSHelper.shadowTokenValueToCSS((token as ShadowToken).value, mappedTokens, {
        allowReferences: true,
        decimals: 2,
        colorFormat: colorFormat,
        tokenToVariableRef: (t) => createTokenName(t, tokenType, tokenGroups),
      });
      break;
    }
    case TokenType.size:
      value = CSSHelper.dimensionTokenValueToCSS((token as SizeToken).value, mappedTokens, {
        allowReferences: true,
        decimals: 2,
        colorFormat: colorFormat,
        tokenToVariableRef: (t) => createTokenName(t, tokenType, tokenGroups),
      });
      break;
    case TokenType.fontWeight:
    case TokenType.fontFamily:
      value = CSSHelper.stringTokenValueToCSS((token as StringToken).value, mappedTokens, {
        allowReferences: true,
        decimals: 2,
        colorFormat: colorFormat,
        tokenToVariableRef: (t) => createTokenName(t, tokenType, tokenGroups),
      });
      break;

    default:
      throw new Error('Token type ' + tokenType + ' not defined');
  }

  value = removeEveryUnitIfValueZero(value);

  return name + ': ' + value + ';';
}

/**
 * Comparator function for custom sorting logic.
 * Strings containing ': $' come after the strings which don't contain it.
 * Only strings without ': $' are sorted alphabetically.
 *
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {number} - A negative number if a should come before b,
 *                     a positive number if a should come after b,
 *                     or 0 if they are equivalent in sorting order.
 */
function alphabeticalWithReferencesComparator(a: string, b: string): number {
  const referenceIdentifier = ': $';

  const hasDollarA = a.includes(referenceIdentifier);
  const hasDollarB = b.includes(referenceIdentifier);

  if (hasDollarA && !hasDollarB) {
    return 1; // a comes after b
  } else if (!hasDollarA && hasDollarB) {
    return -1; // a comes before b
  } else if (!hasDollarA && !hasDollarB) {
    // Both don't have ': $', sort alphabetically
    return a.localeCompare(b);
  } else {
    // Both have ': $', maintain their original order
    return 0;
  }
}

function removeEveryUnitIfValueZero(val: string): string {
  // Remove when starting with 0
  val = val.replace(/^0(px|em|rem|%|vw|vh)/g, '0');
  // Remove every other 0
  val = val.replace(/ 0(px|em|rem|%|vw|vh)/g, ' 0');

  return val;
}
