edn.js: ./src/edn.jison ./src/edn.js
	echo "(function() {\n" > edn.js
	./node_modules/.bin/jison -m js -o parser.js~ ./src/edn.jison
	cat parser.js~ >> edn.js
	rm parser.js~
	cat ./src/edn.js >> edn.js
	echo "})();\n" >> edn.js

node_modules:
	npm install

build: node_modules edn.js

test: build
	./node_modules/.bin/jshint src/*.js
	./node_modules/.bin/jshint test/*.js
	./node_modules/.bin/nodeunit test/

node_modules/nodeunit/node_modules: node_modules
	cd node_modules/nodeunit && npm install

node_modules/nodeunit/dist/browser/nodeunit.js: node_modules/nodeunit/node_modules
	cd node_modules/nodeunit && make browser

browser: node_modules/nodeunit/dist/browser/nodeunit.js

.PHONY: test browser
