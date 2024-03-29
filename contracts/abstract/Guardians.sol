// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {IGuardians} from "../interfaces/IGuardians.sol";
import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

abstract contract Guardians is IGuardians, Ownable2Step, Pausable {
    /**
     * @notice Mapping of addresses to guardian status
     */
    mapping(address guardian => bool isGuardian) public guardians;

    // MODIFIERS
    /**
     * @notice Only allow the owner or a guardian to call the protected function
     */
    modifier onlyGuardian() {
        if (msg.sender != owner() && !guardians[msg.sender]) {
            revert(OnlyGuardian());
        }
        _;
    }

    // CONSTRUCTOR
    /**
     * @notice Set initial owner address
     *
     * @param _initialOwner Address of the initial owner
     */

    constructor(address _initialOwner) {
        _transferOwnership(_initialOwner);
    }

    // PERMISSIONED FUNCTIONS
    /**
     * @inheritdoc IGuardians
     */
    function addGuardian(address guardian) external onlyOwner {
        guardians[guardian] = true;
        emit GuardianAdded(guardian);
    }

    /**
     * @inheritdoc IGuardians
     */
    function removeGuardian(address guardian) external onlyOwner {
        guardians[guardian] = false;
        emit GuardianRemoved(guardian);
    }

    /**
     * @inheritdoc IGuardians
     */
    function pause() external onlyGuardian {
        _pause();
    }

    /**
     * @inheritdoc IGuardians
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
