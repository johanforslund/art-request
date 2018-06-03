pragma solidity ^0.4.0;

//TO DO: Efter 3 dagar om inte A har accepterat/nekat så kan submitter få sin ether

contract ImageRequest {
    struct Submission {
        string url;
        string email;
        address submitter;
        bool previewApproved;
        uint deadline;
        bool finalized;
        string[] finals;
    }

    address public creator;
    string public title;
    string public description;
    string public imageUrl;
    uint public reward;
    uint public numberOfPreviewApprovals;
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
        numberOfPreviewApprovals = 0;
    }

    function submitPreview(string url, string email) public {
        string[] memory finals;

        Submission memory newSubmission = Submission({
            url: url,
            email: email,
            submitter: msg.sender,
            previewApproved: false,
            deadline: 0,
            finalized: false,
            finals: finals
        });

        submissions.push(newSubmission);
    }

    function submitFinal(uint index, string url) public payable {
        require(submissions[index].previewApproved);
        if (submissions[index].finals.length == 0) {
            require(msg.value >= 1 ether);
        }
        submissions[index].finals.push(url);
    }

    function approvePreview(uint index) public restricted {
        submissions[index].previewApproved = true;
        submissions[index].deadline = now + 259200;
        numberOfPreviewApprovals++;
    }

    function approveFinal(uint index) public restricted {
        require(submissions[index].previewApproved);
        submissions[index].submitter.transfer(reward);
        submissions[0].finalized = true;
        creator.transfer(1 ether);
    }

    function cancelApproval(uint index) public restricted {
        require(submissions[index].deadline < now);
        require(submissions[index].finals.length == 0);
        submissions[index].previewApproved = false;
        numberOfPreviewApprovals--;
    }

    function remove() public restricted {
        require(numberOfPreviewApprovals == 0);
        creator.transfer(reward);
        //selfdestruct, men detta måste göras noggrant
    }

    function getFinal(uint i, uint j) public view returns (string) {
        return submissions[i].finals[j];
    }

}
