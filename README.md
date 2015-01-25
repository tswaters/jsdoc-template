# JSDoc Template

This is a jsdoc template that is very close the the default one.

## Changes 

* Adds bootstrap and a few styling changes.
* Fixed navbar using dropdown menus.
* Fixed inline navigation for elements on current page.

## Usage

```
jsdoc -t /path/to/jsdoc-template
```

If you are using grunt-jsdoc, be sure to install that latest jsdoc in your project directory.  It ships with an older version that may not work 100% with this template, but it is good enough to pick up the one in node_modules your directory and use that.

There is one custom property in 'sample-jsdoc.conf.json' - this "name" is used as text for the "brand" element in the navbar.

## Magic?

I had to work what seemed to me to be magic git commands to get upstream tracking with the default jsdoc template

See the following gist for details on the commands: https://gist.github.com/tswaters/542ba147a07904b1f3f5
