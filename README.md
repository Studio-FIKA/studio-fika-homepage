# Studio FIKA Homepage

This Git-repository holds the source code for
[Studio FIKA's homepage](https://studiofika.fi/) and it is a
[Hugo](https://gohugo.io/) project.

## Hugo

### Version

Currently the project has been configured to use Hugo version 0.92.0 (extended). This version is used by `docker-compose` and Netlify builds. `gh-pages.yml` is currently not in use but its Hugo version should be kept in sync as well.

## Development

### Preparing development environment

#### Installing Hugo

See
[Hugo installing documentation](https://gohugo.io/getting-started/installing/).
This project was created with version `hugo v0.92.0+extended darwin/amd64`.

#### Installing dependencies

```sh
npm ci
```

#### Preparing Husky

Husky is setup to run a pre-commit Git hook that runs `eslint` for your code
before a commit:

```sh
npm run prepare
```

### Running development server

#### Docker

Remember to start Docker, e.g. on Fedora (35) (depends on your configuration of course):

```sh
sudo systemctl start docker
```

And then run `docker-compose` in the root of the project:

```sh
sudo docker-compose up
```

#### With Hugo CLI directly

Via NPM:

```sh
npm run dev
```

Or alternatively directly with Hugo CLI as using the npm script can leave the
Hugo server running in the background after a crash in which case you'd need to
go through some extra trouble to have it shut down):

```sh
hugo server
```

## Useful resources

- [Easy favicon generation](https://favicon.io/favicon-generator/)
- [Basic Hugo SEO set up instructions](https://moonbooth.com/hugo/seo/)
- [Custom 404 page with correct HTTP status set up instructions for Netlify](https://moonbooth.com/hugo/custom-404/)
