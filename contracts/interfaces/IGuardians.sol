// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

interface IGuardians {
    // EVENTS
    /**
     *
     * @param guardian Address of the added guardian
     */
    event GuardianAdded(address indexed guardian);

    /**
     *
     * @param guardian Address of the removed guardian
     */
    event GuardianRemoved(address indexed guardian);

    // ERRORS
    /**
     * @notice Add an address as a guardian | Only callable by the owner
     *
     * @param guardian Address to be added as a guardian
     */

    function addGuardian(address guardian) external;

    /**
     * @notice Remove an address as a guardian | Only callable by the owner
     *
     * @param guardian Address to be removed as a guardian
     */
    function removeGuardian(address guardian) external;

    /**
     * @notice Pause the contract | Only callable by the owner or guardian
     */
    function pause() external;

    /**
     * @notice Unpause the contract | Only callable by the owner
     */
    function unpause() external;
}
