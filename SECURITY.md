# Security Policy

## Sensitive data

Do not include any of the following in an issue, discussion, pull request, screenshot, or log:

- `.auth/msal-cache.json`
- access tokens, refresh tokens, or ID tokens
- device login codes
- client secrets
- personal task IDs or task contents
- email addresses or tenant identifiers

If a token is exposed, revoke the application's consent or the relevant account sessions and sign in again before continuing.

## Reporting a vulnerability

Please use GitHub's private security-advisory reporting feature when it is available for this repository. Otherwise, open a minimal issue that contains no credentials or personal data and asks the maintainer for a private contact channel.
