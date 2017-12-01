pragma solidity ^0.4.8;

import './zeppelin/ownership/Ownable.sol';

contract Post is Ownable {
    
    event PostCreated(bytes32 id, bytes32 pictureHash, bytes32 contentHash, address creator);

    struct Post {
        bytes32 id;
        bytes32 pictureHash;
        bytes32 contentHash;
        address creator;
    }

    Post[] public posts;

    mapping (bytes32 => Post) public postMap;
    
    function addPost(bytes32 _id, bytes32 _pictureHash, bytes32 _contentHash) returns (bool) {
        Post storage post;
        post.id = _id;
        post.pictureHash = _pictureHash;
        post.contentHash = _contentHash;
        post.creator = msg.sender;
        posts.push(post);
        PostCreated(_id, _pictureHash, _contentHash, msg.sender);
        return true;
    }
    
    function getPost(bytes32 _id) constant returns (bytes32, bytes32, address) {
        return (postMap[_id].pictureHash, postMap[_id].contentHash, postMap[_id].creator);
    }
    
    function() payable {
        revert();
    }
}
