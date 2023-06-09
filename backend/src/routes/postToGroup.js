const express = require("express");
const router = express.Router();
const { postToGroup } = require("../controllers/groupController"); 

router.post("/", async (req, res) => {
    const { groupIds, message, accessToken } = req.body;
  
    const promises = groupIds.map(async (groupId) => {
      try {
        const response = await postToGroup(groupId, message, accessToken);
        console.log(`Posted to group ${groupId}:`, response);
        return { groupId, success: true };
      } catch (error) {
        console.error(`Error posting to group ${groupId}:`, error.message);
        return { groupId, success: false, error: error.message };
      }
    });
  
    const results = await Promise.all(promises);
    const failedPosts = results.filter((result) => !result.success);
  
    if (failedPosts.length > 0) {
      res.status(400).json({
        message: "Please check if your access token is correct.",
        failedPosts,
      });
    } else {
      res.json({ message: "Successfully posted to groups." });
    }
  });

  module.exports = router;

  