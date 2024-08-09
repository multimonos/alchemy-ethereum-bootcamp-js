
.PHONY: all

build:
	forge build ./src/lesson-04/Counter.sol
test:
	forge test --watch --mp ./src/lesson-04/Counter.t.sol