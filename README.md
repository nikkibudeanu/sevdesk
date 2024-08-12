# SCSS Custom Exporter for Supernova

> **tl;dr:** This custom SCSS exporter allows you to export your design system assets and styles directly into SCSS files, ready for integration into [OffenburgUI](https://github.com/sevdesk/offenburg-ui). It iterates through all token categories and excludes any that are empty. For each remaining category, it generates a separate SCSS file containing the tokens as SCSS variables (prefixed with dollar signs).

## Getting Started

1. **Installation:**

   - Clone this repository or download the files.
   - Follow the instructions in the Supernova documentation to install the exporter in your Supernova workspace ([https://github.com/Supernova-Studio/exporter-documentation](https://github.com/Supernova-Studio/exporter-documentation)).

2. **Configuration (Optional):**

   - This exporter might have optional configuration files allowing you to customize the output format (e.g., variable naming conventions). Refer to the included documentation for details.

3. **Exporting:**
   - In your Supernova project, select the elements or styles you want to export.
   - Use the Supernova export functionality and choose this custom SCSS exporter.
   - The exporter will generate SCSS files containing the corresponding variables and mixins.

## How does it work?

### Typography Mixins

Typography generation requires a more complex approach due to the lack of built-in mixin support in Supernova (unlike its CSS variable helpers). Currently, the exporter creates custom mixins solely for `font` shorthand, `letter-spacing`, and `text-indent` properties.

### Referencing Limitations

Supernova can identify references between variables within a single file and replicate these references in the generated SCSS. However, referencing across multiple SCSS files is not yet supported.

### Exporter Settings

This exporter offers several configuration options accessible through the Supernova UI:

- **generateDisclaimer (boolean):** When enabled, a disclaimer is added to each generated file, stating that it's auto-generated and shouldn't be modified manually.
- **disclaimerText (string):** Customize the disclaimer text displayed in each generated file (relevant when `generateDisclaimer` is true).
- **colorFormat (ColorFormat):** Specify the format for exported colors.

### General Benefits

- **Streamlined Workflow:** Simplifies the process of integrating OffenburgUI design system into SCSS codebase.
- **Maintain Consistency:** Ensures design system styles are used consistently across sevDesk projects.
- **Flexibility:** Provides control over the structure and naming conventions of the generated SCSS code.

## Additional Notes

This exporter assumes a basic understanding of SCSS variables and mixins.

For more advanced customization options, refer to the Supernova documentation on building custom exporters ([https://github.com/Supernova-Studio/exporter-documentation](https://github.com/Supernova-Studio/exporter-documentation)).

## Contributing

We welcome contributions to this exporter! Feel free to submit pull requests with improvements or bug fixes.
