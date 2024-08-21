# upgradeable contracts

## refs

- https://docs.openzeppelin.com/upgrades-plugins/1.x/foundry-upgrades

## checklist

### setup
- update `foundry.toml` config
- install openzeppelin dependencies using `make upgradeable-install`
- create contracts `VendingMachineV1, VendingMachineV2`
- build contracts using `make upgradeable-build` 
- check json build artifacts have the `"storageLayout"` prop using `make upgradeable-check-json`

### validate
- add natspec to `v1` which denotes contract supports upgrades `/// @custom:oz-upgrades`
- add natspec to `v2` which denotes contract upgrades from v1 `/// @custom:oz-upgrades-from VendingMachineV1`
- validate both contracts using `make upgradeable-validate` 
- you should see fully qualified paths for validation and `SUCCESS` x2

### add the initializer
- for `v1` import `import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";`
- run `make upgradeable-validate`
- for `v1` add `initializer`
- for `v1` add `uint private _version;`
- for `v1` set `_version = 1;` in `initializer()`
- run `make upgradeable-validate`
- fix errors in `v2`

