const express = require("express");
const router = express.Router();

const {
  requestService,
  myRequests,
  CareseekerRequests,
  acceptRequest,
  rejectRequest,
  acceptedRequests,
  rejectedRequests,
  khaltipayment,
  fileComplaint,
} = require("../controllers/serviceRequests");
router.post("/khaltiapi", khaltipayment);
router.route("/:id").post(requestService);
router.route("/").get(myRequests);
router.post("/:id/complaint", fileComplaint);
router.route("/careseekerRequests").get(CareseekerRequests);
router.route("/:id/accept").patch(acceptRequest);
router.route("/:id/reject").patch(rejectRequest);
router.route("/acceptedrequests").get(acceptedRequests);
router.route("/rejectedrequests").get(rejectedRequests);
module.exports = router;
