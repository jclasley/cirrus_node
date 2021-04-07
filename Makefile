build:
	npm install
	npm run build
test:
	jest src --collectCoverage --reporters='jest-nyancat-reporter'

all:
	make test build