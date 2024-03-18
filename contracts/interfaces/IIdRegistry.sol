// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

interface IIdRegistry {
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Structs XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    struct RegisterData {
        uint256 id; // aizen id
        address custody; // custody address
        address recovery; // recovery address
    }

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Errors XXXXXXXXXXX

    /// @dev Revert when caller is not authorized to perform a specific action
    error Unauthorized();

    /// @dev Revert when the provided id is already registered
    error AlreadyRegistered();

    /// @dev Revert when the caller should have an id but does not
    error HasNoId();

    /// @dev Revert when Gateway is disabled/frozen
    error GatewayFrozen();

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Events XXXXXXXXXXX
    /**
     * @notice Emitted when a new id is registered
     *         - `id` is the aizen id
     *         - Nodes listen for this event to update their local id registry
     * 1. Two register events cannot emit with the same id
     * 2. Two register events cannot emit with the same custody unless a transfer of custody has happened from Alice to Bob
     * @param to address indexed to - the custody address that the id is registered to
     * @param id uint256 indexed id - the aizen id registered
     * @param recovery address recovery - the address that can initiate recovery request for aizen id
     */
    event Register(address indexed to, uint256 indexed id, address recovery);
}
