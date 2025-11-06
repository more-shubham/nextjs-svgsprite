# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the severity of the vulnerability.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability in the Next.js SVG Sprite Plugin, please report it to us as described below.

### Where to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to the repository maintainers. You can find the maintainer information in the package.json file.

### What to Include

When reporting a vulnerability, please include the following information:

- Type of vulnerability (e.g., XSS, CSRF, SQL injection, path traversal)
- Full paths of source file(s) related to the manifestation of the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

This information will help us triage your report more quickly.

### What to Expect

After you submit a report, you can expect:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 72 hours.

2. **Assessment**: We will assess the vulnerability and determine its severity and impact.

3. **Fix Development**: If confirmed, we will work on developing a fix.

4. **Release**: We will release a patch as soon as possible, depending on the complexity of the issue.

5. **Credit**: With your permission, we will acknowledge your responsible disclosure in the release notes.

## Security Best Practices

When using this plugin in your project, please follow these security best practices:

### 1. Input Validation

- Always validate SVG files before adding them to the `svg-icons` directory
- Ensure SVG files do not contain malicious scripts or external references
- Use trusted sources for SVG icons

### 2. File System Security

- Do not allow user-uploaded files to be processed as icons
- Ensure the `svg-icons` directory has appropriate file permissions
- Do not expose the `svg-icons` directory via a web server

### 3. Build Process

- Run the build script only in trusted environments
- Review generated sprite files before deploying to production
- Use automated security scanning tools in your CI/CD pipeline

### 4. Dependencies

- Keep all dependencies up to date
- Regularly run `npm audit` to check for known vulnerabilities
- Review security advisories for Next.js and other dependencies

### 5. Production Deployment

- Use long-term caching for sprite files (already configured)
- Serve sprite files with appropriate Content-Security-Policy headers
- Consider using a CDN for serving sprite files

## Known Security Considerations

### SVG Content Security

SVG files can potentially contain:

- JavaScript code (via `<script>` tags)
- External resource references
- Event handlers (e.g., `onclick`, `onload`)

**Mitigation**: This plugin uses the `svgstore` library which:

- Removes `<script>` tags by default
- Sanitizes SVG content during sprite generation
- Only preserves essential styling attributes

### Path Traversal

The build script reads files from the `svg-icons` directory.

**Mitigation**:

- The script only processes files within the specified directory
- Symbolic links are followed safely
- No user input is used to construct file paths during runtime

### Denial of Service

Processing a large number of SVG files could consume significant resources.

**Mitigation**:

- The build script runs at build time, not runtime
- There are no runtime limitations on sprite serving
- Sprite files are cached with long-term headers

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.1, 1.0.2) and will be clearly marked in the release notes.

To stay informed about security updates:

1. Watch this repository for releases
2. Subscribe to the repository notifications
3. Check the release notes regularly

## Additional Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

## Questions?

If you have questions about security that are not related to vulnerability reporting, please open a GitHub issue with the "security" label.
