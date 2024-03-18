// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

interface ISignatures {
    /**
     * @dev Revert if invalid signature
     */
    error InvalidSignature();

    /**
     * @dev Revert if block.timestamp is ahead of signature deadline
     */
    error SignatureExpired();
}
