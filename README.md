OMDb Movie Catalog
=================
[Demo site](https://changliuunsw.github.io/)

This website is based on [OMDb API](http://www.omdbapi.com/)

## How to start

**Note** that this project is based on node v4.4.5 and npm 3.10.2.

If you have problems to run this project, please check your node and npm versions.

In order to run this project:

```bash
# install bower
npm install bower -g
# install the project's dependencies
npm install
# Install bower dependencies
bower install

# build
gulp
# preview unminified version
gulp serve
# preview minified version
gulp serve:prod
```

## Testing

Running `gulp test` will run the unit tests with karma.
