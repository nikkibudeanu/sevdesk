import { FileHelper, NamingHelper, StringCase } from '@supernovaio/export-helpers';
import {
  Supernova,
  PulsarContext,
  RemoteVersionIdentifier,
  AnyOutputFile,
  TokenType,
} from '@supernovaio/sdk-exporters';
import { ExporterConfiguration } from '../config';
import { createStylesContent } from './content/content';

/**
 * Export entrypoint.
 * When running `export` through extensions or pipelines, this function will be called.
 * Context contains information about the design system and version that is currently being exported.
 */
Pulsar.export(async (sdk: Supernova, context: PulsarContext): Promise<Array<AnyOutputFile>> => {
  // Fetch data from design system that is currently being exported (context)
  const remoteVersionIdentifier: RemoteVersionIdentifier = {
    designSystemId: context.dsId,
    versionId: context.versionId,
  };

  // Fetch the necessary data
  let tokens = await sdk.tokens.getTokens(remoteVersionIdentifier);
  let tokenGroups = await sdk.tokens.getTokenGroups(remoteVersionIdentifier);

  const mappedTokens = new Map(tokens.map((token) => [token.id, token]));
  let categorizedTokens = Object.keys(TokenType)
    .filter((tokenType) => tokens.filter((token) => token.tokenType === TokenType[tokenType]).length > 0)
    .map((tokenType) => [
      tokenType,
      createStylesContent(
        tokens.filter((t) => t.tokenType === TokenType[tokenType]),
        TokenType[tokenType],
        mappedTokens,
        tokenGroups,
        exportConfiguration.colorFormat
      ),
    ]);

  let indexContent = categorizedTokens
    .map(([key]) => `@import '${NamingHelper.codeSafeVariableName(key, StringCase.paramCase)}';`)
    .sort((a, b) => a.localeCompare(b));

  if (exportConfiguration.generateDisclaimer) {
    const disclaimer = `/* ${exportConfiguration.disclaimerText} */`;

    indexContent = [disclaimer, ...indexContent];
    categorizedTokens = categorizedTokens.map(([key, val]) => [key, disclaimer + '\n' + val]);
  }

  return [
    ...categorizedTokens.map(([key, value]) =>
      FileHelper.createTextFile({
        relativePath: './',
        fileName: NamingHelper.codeSafeVariableName(key, StringCase.paramCase) + '.scss',
        content: value,
      })
    ),
    FileHelper.createTextFile({
      relativePath: './',
      fileName: 'index.scss',
      content: indexContent.join('\n'),
    }),
  ];
});

/** Exporter configuration. Adheres to the `ExporterConfiguration` interface and its content comes from the resolved default configuration + user overrides of various configuration keys */
export const exportConfiguration = Pulsar.exportConfig<ExporterConfiguration>();
