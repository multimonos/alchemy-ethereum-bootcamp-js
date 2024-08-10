
.PHONY: all build test deploy

build:
	@forge build ./src/lesson-04/Counter.sol

test:
	@forge test --watch --mc CounterTest

deploy:
	@forge clean
	@forge script ./src/lesson-04/Counter.s.sol --json --broadcast --rpc-url=$(ANVIL_URL) --private-key=$(ANVIL0_PKEY)
	@cp ./out/Counter.sol/Counter.json ./src/lesson-04/counter-abi.json