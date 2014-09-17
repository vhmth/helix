.DEFAULT_GOAL=dist

.PHONY: clean
clean:
	@rm -rf dist

.PHONY: dist
dist: clean
	@mkdir -p dist
	@./node_modules/.bin/browserify -d src/index.js > dist/helix.js
