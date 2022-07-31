install-ci:
	npm ci

install:
	npm install

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

run:
	npm start
