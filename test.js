/*
 * gulp-render
 * https://github.com/koistya/gulp-render
 *
 * Copyright (c) 2014 Konstantin Tarkus
 * Licensed under the MIT license
 */

/* global require, Buffer, it */

'use strict';

var assert = require('assert');
var gutil = require('gulp-util');
var render = require('./');

it('Should render a simple React component', function(cb) {

  var stream = render();

  stream.on('data', function(file) {
    var contents = file.contents.toString('utf8');
    assert(contents.indexOf('Hello world!') != -1);
    cb();
  });

  stream.write(new gutil.File({
    path: 'SampleComponent.jsx',
    cwd: __dirname,
    contents: new Buffer(
      'var React = require("./node_modules/react"); ' +
      'var ReactDOM = require("./node_modules/react-dom/server");' +
      'var createReactClass = require("./node_modules/create-react-class");' +
      'var HelloMessage = createReactClass({' +
      '  render: function() {return React.createElement("div", null, "Hello world!");}' +
      '}); '+
      'module.exports = HelloMessage;'
    )
  }));

});

it('Should render a simple React component with a template', function(cb) {

  var stream = render({
    template: '<html><head><title><%=title%></title></head><body><%=body%></body></html>',
    data: { title: 'Title123' }
  });

  stream.on('data', function(file) {
    var contents = file.contents.toString('utf8');
    assert(contents.indexOf('Hello world!') != -1);
    assert(contents.indexOf('<title>Title123</title>') != -1);
    cb();
  });

  stream.write(new gutil.File({
    path: 'SampleComponent.jsx',
    cwd: __dirname,
    contents: new Buffer(
      'var React = require("./node_modules/react"); ' +
      'var ReactDOM = require("./node_modules/react-dom/server");' +
      'var createReactClass = require("./node_modules/create-react-class");' +
      'var HelloMessage = createReactClass({' +
      '  render: function() {return React.createElement("div", null, "Hello world!");}' +
      '}); '+
      'module.exports = HelloMessage;'
    )
  }));

});

it('Should render a simple React component as static markup', function(cb) {

  var stream = render({
    staticMarkup: true
  });

  stream.on('data', function(file) {
    var contents = file.contents.toString('utf8');
    assert(contents.indexOf('data-react') === -1);
    cb();
  });

  stream.write(new gutil.File({
    path: 'SampleComponent.jsx',
    cwd: __dirname,
    contents: new Buffer(
      'var React = require("./node_modules/react"); ' +
      'var ReactDOM = require("./node_modules/react-dom/server");' +
      'var createReactClass = require("./node_modules/create-react-class");' +
      'var HelloMessage = createReactClass({' +
      '  render: function() {return React.createElement("div", null, "Hello world!");}' +
      '}); '+
      'module.exports = HelloMessage;'
    )
  }));

});

it('Should render a simple React component with a template and data function', function(cb) {

  var stream = render({
    template: '<html><head><title><%=title%></title></head><body><%=body%></body></html>',
    data: function(file) {
      return { title: 'Test123' + file.path };
    }
  });

  stream.on('data', function(file) {
    var contents = file.contents.toString('utf8');
    assert(contents.indexOf('Hello world!') != -1);
    assert(contents.indexOf('<title>Test123SampleComponent.jsx</title>') != -1);
    cb();
  });

  stream.write(new gutil.File({
    path: 'SampleComponent.jsx',
    cwd: __dirname,
    contents: new Buffer(
      'var React = require("./node_modules/react"); ' +
      'var ReactDOM = require("./node_modules/react-dom/server");' +
      'var createReactClass = require("./node_modules/create-react-class");' +
      'var HelloMessage = createReactClass({' +
      '  render: function() {return React.createElement("div", null, "Hello world!");}' +
      '}); '+
      'module.exports = HelloMessage;'
    )
  }));

});
