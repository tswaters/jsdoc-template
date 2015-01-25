var helper = require('jsdoc/util/templateHelper');
var taffy = require('taffydb').taffy;
var _ = require('underscore');

module.exports.buildNavbar = function (members) {
  var ret = [];
  ret.push('<ul class="nav navbar-nav">');
  _.each(members, function (member, title) {
    if (member.length === 0) { return; }
    ret.push('<li class="dropdown">');
    ret.push('<a class="dropdown-toggle" data-toggle="dropdown" role="button" href="#">' + title + '<span class="caret"></span></a>');
    ret.push('<ul class="dropdown-menu" role="menu">');
    var seen = {};
    _.each(member, function (thing) {
      if (seen[thing.longname]) { return; }
      seen[thing.longname] = true;
      ret.push('<li>' + helper.linkto(thing.longname, thing.name.replace(/^module:/, '')) + '</li>');
    });
    ret.push('</ul></li>');
  });
  ret.push('</ul>');
  return ret.join('');
};


module.exports.addInlineNavToMembers = function (members, data) {
  console.log(Object.keys(members));
  _.each(members, function (member, title) {
    if (title === 'globals') { return; }
    _.each(member, function (thing) {
      var ret = [];
      ret.push('<ul class="nav nav-stacked fixed">');
      ret.push('<li>' + helper.linkto(thing.longname, thing.name));
      var hasChildren = thing.params || thing.excpetions || thing.fires || thing.examples;
      if (hasChildren) {
        ret.push('<ul class="nav nav-stacked fixed">');
        if (thing.params) { ret.push('<li><a href="#' + thing.id + '-parameters">Parameters</a></li>'); }
        if (thing.fires) { ret.push('<li><a href="#' + thing.id + '-fires">Fires</a></li>'); }
        if (thing.exceptions) { ret.push('<li><a href="#' + thing.id + '-throws">Exceptions</a></li>'); }
        if (thing.examples) { ret.push('<li><a href="#' + thing.id + '-example">Example</a></li>'); }
        ret.push('</ul>');
      }
      ret.push('</li>');

      var stuff = module.exports.getStuff(data, thing, title === 'globals');
      ret.push(stuff.join(''));

      ret.push('</ul>');
      thing.inlineNav = ret.join('');
    });
  });
};

module.exports.addInlineNavToGlobal = function (data) {
  return [
    '<ul class="nav nav-stacked fixed">',
    module.exports.getStuff(data, {id: 'global'}, true).join(''),
    '</ul>'
  ].join('');
};

module.exports.getStuff = function (data, thing, global) {
  var stuff = {
    'Classes': 'class',
    'Mixins': 'mixin',
    'Namespaces': 'namespace',
    'Members': 'member',
    'Methods': 'function',
    'Type Definitions': 'typedef',
    'Events': 'event'
  };

  return _.map(stuff, function (kind, title) {
    // if the global page don't list anything that has it's own page.
    if (global && (
      kind === 'class' ||
      kind === 'mixin' ||
      kind === 'namespace' ||
      kind === 'external' ||
      kind === 'interface') ) { return; }

    //var htmlid = thing.longname + '.html';
    var filter = {'kind': kind, 'memberof': global ? {'isUndefined': true} : thing.longname};
    var seen = {};
    var list = data().filter(filter).map(function (doclet) {
      if (seen[doclet.longname]) { return; }
      seen[doclet.longname] = true;
      var anchor = helper.linkto(doclet.longname, doclet.name);
      // remove anything leading up to '.html' so linker works
      // except for namespaces, they have their own page.
      if (kind !== 'namespace') {
        anchor = anchor.replace(/".+?\.html/, '"');
      }
      return '<li>' + anchor + '</li>';
    });

    if (list.length === 0) { return ''; }
    var ret = [];
    ret.push('<li><a href="#' + thing.id + '-' + kind + '"><b>' + title + '</b></a>');
    ret.push('<ul class="nav nav-stacked">' + list.join('') + '</ul>');
    ret.push('</li>');
    return ret.join('');
  });
};

