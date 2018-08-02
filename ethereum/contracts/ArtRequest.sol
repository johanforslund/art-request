pragma solidity ^0.4.24;

contract RequestFactory {
    address[] public deployedRequests;

    function createRequest(string title, string description, string email, string url) public payable {
        address newRequest = new Request(title, description, email, url, msg.sender, msg.value);
        newRequest.transfer(msg.value);
        deployedRequests.push(newRequest);
    }

    function getDeployedRequests() public view returns (address[]) {
        return deployedRequests;
    }
}

contract Request {
    struct Submission {
        string previewUrl;
        string submitterEmail;
        address submitter;
        bool previewApproved;
    }

    address public requester;
    string public title;
    string public description;
    string public email;
    string public url;
    uint public reward;
    uint public deposit;
    bool public anyPreviewApproved;
    uint public previewApprovedTime;
    uint public approvedPreviewIndex;
    bool public finalized;
    uint public finalSubmissionTime;
    Submission[] public submissions;
    string[] public finals;

    modifier restricted() {
        require(msg.sender == requester);
        _;
    }

    constructor(string _title, string _description, string _email, string _url, address _requester, uint _value) public {
        title = _title;
        description = _description;
        url = _url;
        email = _email;
        requester = _requester;
        reward = _value * 100 / 120;
        deposit = _value - reward; //20% deposit
        anyPreviewApproved = false;
        previewApprovedTime = 0;
        finalSubmissionTime = 0;
    }

    //This is needed for receiving ether from other contract (fallback function)
    function() public payable {

    }

    function submitPreview(string previewUrl, string submitterEmail) public {
        Submission memory newSubmission = Submission({
            previewUrl: previewUrl,
            submitterEmail: submitterEmail,
            submitter: msg.sender,
            previewApproved: false
        });

        submissions.push(newSubmission);
    }

    function submitFinal(string finalUrl) public payable {
        require(submissions[approvedPreviewIndex].previewApproved);
        require(submissions[approvedPreviewIndex].submitter == msg.sender);
        if (finals.length == 0) {
            require(msg.value >= deposit);
        }
        finals.push(finalUrl);
        finalSubmissionTime = now;
    }

    function approvePreview(uint index) public restricted {
        require(!anyPreviewApproved);
        submissions[index].previewApproved = true;
        previewApprovedTime = now;
        anyPreviewApproved = true;
        approvedPreviewIndex = index;
    }

    function approveFinal() public restricted {
        require(finals.length > 0);
        submissions[approvedPreviewIndex].submitter.transfer(reward + deposit);
        if (!finalized) {
            requester.transfer(deposit);
        }
        finalized = true;
    }

    function rejectFinal() public restricted {
        require(!finalized);
        require(finals.length > 0);
        finalized = true;
        requester.transfer(deposit);
    }

    //If person B has not submitted a final submission within 3 days.
    function cancelPreviewApproval() public restricted {
        require(previewApprovedTime < now - 3 days);
        require(finals.length == 0);
        submissions[approvedPreviewIndex].previewApproved = false;
        anyPreviewApproved = false;
    }

    //If person A has not approved/rejected the final submission within 3 days.
    function withdrawNoApproval() public {
        require(finals.length > 0);
        require(submissions[approvedPreviewIndex].submitter == msg.sender);
        require(!finalized);
        require(finalSubmissionTime < now - 3 days);
        submissions[approvedPreviewIndex].submitter.transfer(reward + deposit);
        finalized = true;
    }

    function remove() public restricted {
        require(!anyPreviewApproved || finalized);
        if(!finalized) {
            selfdestruct(requester);
        } else {
            selfdestruct(0x0);
        }
    }


    /* *********************************************************************************************
    GETTERS
    ********************************************************************************************* */

    function getSubmissionsCount() public view returns (uint) {
        return submissions.length;
    }

    //getFinalsCount and get
    function getFinalsCount() public view returns (uint) {
        return finals.length;
    }

    function getSummary() public view returns (address, string, string, string, string, uint, bool, bool) {
        return (
            requester,
            title,
            description,
            email,
            url,
            reward,
            anyPreviewApproved,
            finalized
        );
    }
}
