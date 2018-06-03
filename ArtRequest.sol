pragma solidity ^0.4.0;

contract ImageRequest {
    struct Submission {
        string url;
        string email;
        address submitter;
        bool previewApproved;
        bool finalized;
        string[] finals;
    }

    address public creator;
    string title;
    string description;
    string imageUrl;
    uint public reward;
    bool canCancel;
    Submission[] public submissions;

    modifier restricted() {
        require(msg.sender == creator);
        _;
    }

    constructor(string _title, string _description, string _imageUrl) public payable {
        title = _title;
        description = _description;
        imageUrl = _imageUrl;
        creator = msg.sender;
        reward = msg.value;
        canCancel = true;
    }

    function submitPreview(string url, string email) public {
        string[] memory finals;

        Submission memory newSubmission = Submission({
            url: url,
            email: email,
            submitter: msg.sender,
            previewApproved: false,
            finalized: false,
            finals: finals
        });

        submissions.push(newSubmission);
    }

    function submitFinal(uint index, string url) public payable {
        if (submissions[index].finals.length == 0) {
            require(msg.value >= 1 ether);
        }
        submissions[index].finals.push(url);
    }

    function approvePreview(uint index) public restricted {
        submissions[index].previewApproved = true;
        canCancel = false;
    }

    function approveFinal(uint index) public restricted {
        require(submissions[index].previewApproved);
        submissions[index].submitter.transfer(reward + 1 ether);
        submissions[0].finalized = true;
        creator.transfer(1 ether);
    }

    function cancel() public restricted {
        require(canCancel);
        creator.transfer(reward);
    }

}
