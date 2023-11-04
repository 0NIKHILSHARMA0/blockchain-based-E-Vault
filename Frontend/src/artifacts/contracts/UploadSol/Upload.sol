pragma solidity >=0.7.0 <0.9.0;

contract Upload {
    struct Access {
        address user;
        bool hasAccess;
    }

    mapping(address => string[]) private userResources;
    mapping(address => mapping(address => bool)) private ownership;
    mapping(address => Access[]) private accessList;
    mapping(address => mapping(address => bool)) private previousData;

    function addResource(string memory url) external {
        userResources[msg.sender].push(url);
    }

    function allowAccess(address user) external {
        ownership[msg.sender][user] = true;

        if (previousData[msg.sender][user]) {
            for (uint i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].hasAccess = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(user, true));
            previousData[msg.sender][user] = true;
        }
    }

    function disallowAccess(address user) public {
        ownership[msg.sender][user] = false;

        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].hasAccess = false;
            }
        }
    }

    function displayResources(address user) external view returns (string[] memory) {
        require(user == msg.sender || ownership[user][msg.sender], "You don't have access");
        return userResources[user];
    }

    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }
}