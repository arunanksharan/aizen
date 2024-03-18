// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

interface INonces {
    /**
     * @notice Increase nonce for the given calling account, in turn invalidatin previous signatures
     * @return uint256 - incremented nonce for the caller
     */
    function useNonce() external returns (uint256);
}
