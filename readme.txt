tsc
npx webpack
https://webpack.js.org/guides/getting-started/


To tell Webpack to minimize everything except one specific function, you can use the terser-webpack-plugin along with a custom configuration to exclude the specific function from minification. Here's how you can achieve this:

Install the terser-webpack-plugin if you haven't already:

bash
Copy code

npm install terser-webpack-plugin --save-dev
Update your Webpack configuration file (webpack.config.js) to include the terser-webpack-plugin and configure it to exclude the specific function from minification. Here's an example configuration:

javascript
Copy code

const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // Other configuration options
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.log statements
          },
          mangle: {
            reserved: ['specificFunctionName'] // Exclude specific function from minification
          },
        },
      }),
    ],
  },
};
Replace 'specificFunctionName' with the name of the function you want to exclude from minification.

Save the changes to your Webpack configuration file.

By configuring the terser-webpack-plugin with the mangle.reserved option for the specific function you want to exclude from minification, Webpack will minimize everything except that function. This allows you to control which parts of your code are minified and which parts are left unchanged.




PS C:\Users\d146n0\Desktop\GemgineTS> npm install --save-dev typedoc

added 21 packages, and audited 23 packages in 6s

3 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS C:\Users\d146n0\Desktop\GemgineTS> npx typedoc
[warning] No entry points were provided or discovered from package.json exports, this is likely a misconfiguration
[warning] The --name option was not specified, and no package.json was found. Defaulting project name to "Documentation"
[info] html generated at ./docs
[warning] Found 0 errors and 2 warnings
PS C:\Users\d146n0\Desktop\GemgineTS> npx typedoc
[warning] The --name option was not specified, and no package.json was found. Defaulting project name to "Documentation"
[info] html generated at ./docs
[warning] Found 0 errors and 1 warnings
PS C:\Users\d146n0\Desktop\GemgineTS> 

npm install typedoc-plugin-merge-modules --save-dev