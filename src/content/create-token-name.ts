import { NamingHelper, StringCase } from '@supernovaio/export-helpers';
import { TokenGroup } from '@supernovaio/sdk-exporters';

/**
 * Generate token name as a dollar sign variable.
 * @param token
 * @param tokenType
 * @param tokenGroups
 * @returns string
 */
export function createTokenName(token, tokenType: string, tokenGroups: Array<TokenGroup>): string {
  const parent = tokenGroups.find((group) => group.id === token.parentGroupId)!;

  return '$' + NamingHelper.codeSafeVariableNameForToken(token, StringCase.paramCase, parent, tokenType);
}
