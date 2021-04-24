const cacheBuster = require('@mightyplow/eleventy-plugin-cache-buster')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const yaml = require('js-yaml')

const markdownLibrary = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
}).use(markdownItAnchor)

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(cacheBuster({
    outputDirectory: 'public',
  }))

  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy('content/robots.txt*')
  eleventyConfig.addPassthroughCopy('content/**/*.pdf')
  eleventyConfig.addPassthroughCopy({
    'assets/logos/favicon.ico': 'favicon.ico',
  })

  const years = [2016, 2017, 2018, 2019, 2020]
  years.forEach(year => {
    eleventyConfig.addPassthroughCopy({
      [`archive/archive-${year}`]: `archive-${year}`,
      [`archive/assets-${year}`]: `assets-${year}`,
    })
  })

  eleventyConfig.setUseGitIgnore(false)

  eleventyConfig.setLibrary('md', markdownLibrary)

  // Extra data formats
  eleventyConfig.addDataExtension('yml', contents => yaml.load(contents))
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents))

  return {
    // Use nunjucks for template usage (like includes) within Markdown files
    markdownTemplateEngine: 'njk',

    templateFormats: [
      'md',
      'njk',
    ],

    dir: {
      input: 'content/',
      includes: '_includes',
      layouts: '_layouts',
      output: 'public',
    },

    passthroughFileCopy: true,
  }
}
