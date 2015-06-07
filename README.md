# Complete-Meteor-Account-Pipeline
<b>Meteor.js: Easier & Complete Default Account System Files</b><br>
The account backend in meteor is pretty decent, and is wired up to all the basics, but manipulating the front end is an exercise in frustration, and wiring up the additional features is a headache. The CSS is all wrapped up in compiled files and LASS. So you install one of the packages that removes the styling, but even that makes it a huge pain to change or manipulate the UI. And even then, that UI is tied to some of the basic vanilla behavior and leaves out a lot of the smart and complex features that are available and sometimes necessary.

So instead of making a package that would just be difficult to customize to my needs on projects going forward, I baked all features of the Meteor account system down into 3 files:
<pre>
customAccounts.html
customAccounts.css
customAccounts.js
</pre>
By default, all the features are in place, and the UI is styled to match meteor's home page. As well as being broken into easy to understand templates for all states and use cases...using actual buttons instead of a weird hybrid of hyperlinks and buttons. Every account related feature and function is either wired up in the javascript file, or if it's a less common feature, then stubbed in with example uses.

Just drop 'em into your project folder, no package installation required.
https://github.com/CHBDev/Complete-Meteor-Account-Pipeline
