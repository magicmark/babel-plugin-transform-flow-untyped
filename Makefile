any: build

node_modules: package.json
	yarn

build: node_modules
	./node_modules/.bin/flow status
	./node_modules/.bin/babel src -d lib
	./node_modules/.bin/babel examples -d examples_c