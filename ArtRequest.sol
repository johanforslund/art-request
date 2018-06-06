pragma solidity ^0.4.24;

contract ImageRequest {
    struct Submission {
        string url;
        string email;
        address submitter;
        bool previewApproved;
        uint previewApprovedTime;
        uint finalSubmissionTime;
        string[] finals; //Om detta inte fungerar: Skapa en mapping(uint => string) och en finalsCount?
    }

    address public requester;
    string public title;
    string public description;
    string public imageUrl;
    uint public reward;
    uint public deposit;
    bool public anyPreviewApproved;
    bool public finalized;
    Submission[] public submissions;

    modifier restricted() {
        require(msg.sender == requester);
        _;
    }

    constructor(string _title, string _description, string _imageUrl) public payable {
        title = _title;
        description = _description;
        imageUrl = _imageUrl;
        requester = msg.sender;
        reward = msg.value * 100 / 120;
        deposit = msg.value - reward; //20% deposit
        anyPreviewApproved = false;
    }

    function submitPreview(string url, string email) public {
        string[] memory finals;

        Submission memory newSubmission = Submission({
            url: url,
            email: email,
            submitter: msg.sender,
            previewApproved: false,
            previewApprovedTime: 0,
            finalSubmissionTime: 0,
            finals: finals
        });

        submissions.push(newSubmission);
    }

    function submitFinal(uint index, string url) public payable {
        require(submissions[index].previewApproved);
        if (submissions[index].finals.length == 0) {
            require(msg.value >= deposit);
        }
        submissions[index].finals.push(url);
        submissions[index].finalSubmissionTime = now;
    }

    function approvePreview(uint index) public restricted {
        require(!anyPreviewApproved);
        submissions[index].previewApproved = true;
        submissions[index].previewApprovedTime = now;
        anyPreviewApproved = true;
    }

    function approveFinal(uint index) public restricted {
        require(submissions[index].previewApproved);
        require(submissions[index].finals.length > 0);
        submissions[index].submitter.transfer(reward + deposit);
        if (!finalized) {
            requester.transfer(deposit);
        }
        finalized = true;
    }

    function rejectFinal(uint index) public restricted {
        require(!finalized);
        require(submissions[index].previewApproved);
        require(submissions[index].finals.length > 0);
        finalized = true;
        requester.transfer(deposit);
    }

    //If person B has not submitted a final submission within 3 days.
    function cancelPreviewApproval(uint index) public restricted {
        require(submissions[index].previewApproved);
        require(submissions[index].previewApprovedTime < now - 3 days);
        require(submissions[index].finals.length == 0);
        submissions[index].previewApproved = false;
        anyPreviewApproved = false;
    }

    //If person A has not approved/rejected the final submission within 3 days.
    function withdrawNoApproval(uint index) public {
        require(submissions[index].finals.length > 0);
        require(submissions[index].submitter == msg.sender);
        require(!finalized);
        require(submissions[index].finalSubmissionTime < now - 3 days);
        submissions[index].submitter.transfer(reward + deposit);
        finalized = true;
    }

    function remove() public restricted {
        require(!anyPreviewApproved || finalized);
        selfdestruct(requester);
    }


    /* *********************************************************************************************
    GETTERS
    ********************************************************************************************* */

    function getSubmissionsCount() public view returns (uint) {
        return submissions.length;
    }

    //getFinalsCount and get
    function getFinalsCount(uint index) public view returns (uint) {
        return submissions[index].finals.length;
    }

    //Getter, solidity does not auto-generate getters for arrays within structs it seems.
    function finals(uint i, uint j) public view returns (string) {
        return submissions[i].finals[j];
    }
}
