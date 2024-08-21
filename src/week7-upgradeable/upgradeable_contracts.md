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

This basic validation always passes event without `initializer`,

- add natspec to `v1` which denotes contract supports upgrades `/// @custom:oz-upgrades`
- add natspec to `v2` which denotes contract upgrades from v1 `/// @custom:oz-upgrades-from VendingMachineV1`
- validate both contracts using `make upgradeable-validate`
- you should see fully qualified paths for validation and `SUCCESS` x2

### add the initializer

Add the `initializer()` sequentially to v1, run validate, then v2 to see that the validator is checking for issues ... add any other fns.

- in `v1` import `import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";`
- run `make upgradeable-validate`
- in `v1` add `initializer`
- in `v1` add `uint private _version;`
- in `v1` set `_version = 1;` in `initializer()`
- run `make upgradeable-validate`
- fix errors in `v2`

### deploy
- run `make upgradeable-sepolia-deploy`
- look for `ProxyContractAddress`
- run `export proxy=0x......ProxyContractAddress`
- run `make upgradeable-sepolia-call-proxy`
- `foobar()` function call should revert as it's a v2 only fn

### upgrade
- update the `ConfigFactory.Config.ProxyContractAddress`  value for `sepolia` 
- run `make upgradeable-sepolia-upgrade`
- run `make upgradeable-sepolia-call-proxy` ... no need to update the `$proxy` env var!
- `foobar()` function call should return value t's in v2 

## Sepolia Example

I have a working copy of this on sepolia as follows,

```
Proxy 
    0x20967CC44BD6458E63BA5A655ecc3f4dAea89F86
    https://sepolia.etherscan.io/address/0x20967CC44BD6458E63BA5A655ecc3f4dAea89F86#code

VendingMachine1 
    0xCCCCCE0D2d2307BAb1D1C27F7136800aD7aC29a3
    https://sepolia.etherscan.io/address/0xCCCCCE0D2d2307BAb1D1C27F7136800aD7aC29a3#code
    

VendingMachine2
    0x87FA7AA120925977Dd8193D0d68a830a75EB313c 
    https://sepolia.etherscan.io/address/0x87fa7aa120925977dd8193d0d68a830a75eb313c#code
 
```

Issues,

- because `_version` is set in the initializer the value is not updated correctly in v2
