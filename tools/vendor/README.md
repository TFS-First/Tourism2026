# Build compiler

`babel-standalone-7.26.9.cjs` is the unchanged official minified distribution from
https://unpkg.com/@babel/standalone@7.26.9/babel.min.js, the same compiler version
previously loaded in every visitor's browser. It is now used **only by Node.js
while building**. Its MIT license is in `babel-LICENSE.txt`.

It is vendored so builds do not depend on npm registry availability. Do not edit
this third-party file or serve it from index.html. The application has no npm
runtime dependency installation step.
