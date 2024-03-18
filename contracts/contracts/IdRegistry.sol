// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

// contract AizenIdRegistry {
//     event Register(address indexed to, uint256 indexed id);

//     mapping(address owner => uint256 aid) public idOf;
//     mapping(uint256 aid => address custody) public custodyOf;
//     uint256 public idCounter;

//     function unsafeRegister(address registerTo) public {
//         uint256 aid = ++idCounter;
//         idOf[registerTo] = aid;
//         custodyOf[aid] = registerTo;

//         emit Register(registerTo, aid);
//     }
// }
