// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {ISignatures} from "../interfaces/ISignatures.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

abstract contract Signatures is ISignatures {
    function _verifySig(
        bytes32 digest,
        address signer,
        uint256 deadline,
        bytes memory sig
    ) internal view {
        if (block.timestamp > deadline) {
            revert SignatureExpired();
        }
        if (!SignatureChecker.isValidSignature(signer, digest, sig)) {
            revert InvalidSignature();
        }
    }
}
