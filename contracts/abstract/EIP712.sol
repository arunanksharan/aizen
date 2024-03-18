// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {EIP712 as EIP712Base} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {IEIP712} from "../interfaces/IEIP712.sol";

abstract contract EIP712 is IEIP712, EIP712Base {
    constructor(
        string memory name,
        string memory version
    ) EIP712Base(name, version) {}

    function domainSeparatorV4() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function hashTypedDataV4(
        bytes32 structHash
    ) external view returns (bytes32) {
        return _hashTypedDataV4(structHash);
    }
}
