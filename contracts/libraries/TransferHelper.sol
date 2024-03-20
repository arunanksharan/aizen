// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

library TransferHelper {
    /// @dev Revert when a native token transfer fails
    error CallFailed();

    /**
     * @notice Transfer tokens from the caller to the recipient - native tokens
     */
    function sendNative(address to, uint256 amount) internal {
        bool success;

        assembly ("memory-safe") {
            // Transfer native token and store if succeeded or not
            success := call(gas(), to, amount, 0, 0, 0, 0)
        }
        if (!success) revert CallFailed();
    }
}
