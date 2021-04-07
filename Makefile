build:
	npm install
	npm run build
test:
	./node_modules/jest/bin/jest.js src --collectCoverage --reporters='jest-nyancat-reporter'

all:
	make build test