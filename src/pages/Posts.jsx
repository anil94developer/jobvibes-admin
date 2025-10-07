import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  VideoCall as VideoIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { feedApi } from "../api";

const Posts = () => {
  // State management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    job_title: "",
    content: "",
    work_place_name: "On-site",
    job_type: "Full-time",
    cities: "",
    notice_period: 0,
    is_immediate_joiner: false,
    media: null,
    videoStatus: "pending",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState({}); // Track loading state for buttons
  const jobsPerPage = 6;

  // Mock admin check (replace with real auth logic)
  const isAdmin = true;

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await feedApi.getAll({
          page: currentPage,
          limit: jobsPerPage,
          status:
            statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
        });

        const data = response?.data?.results || [];
        const pagination = response?.data?.pagination || { totalPages: 1 };

        setJobs(
          data.map((job) => ({
            ...job,
            videoStatus:
              job.media?.length > 0 ? job.videoStatus || "pending" : undefined,
          }))
        );

        setTotalPages(pagination.totalPages || 1);
        showSnackbar("Jobs fetched successfully", "success");
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
        showSnackbar("Failed to fetch jobs", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, statusFilter]);

  // Update totalPages when statusFilter changes
  useEffect(() => {
    const filteredJobs =
      statusFilter === "All"
        ? jobs
        : jobs.filter((job) => job.status === statusFilter.toLowerCase());
    const calculatedTotalPages =
      Math.ceil(filteredJobs.length / jobsPerPage) || 1;
    setTotalPages(calculatedTotalPages);
    if (currentPage > calculatedTotalPages) {
      setCurrentPage(1); // Reset to first page if currentPage exceeds totalPages
    }
  }, [statusFilter, jobs]);

  // Utility functions
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewJob = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    if (job) {
      setSelectedJob(job);
      setViewDialogOpen(true);
    } else {
      showSnackbar("Job not found", "error");
    }
  };

  const handleCreateJob = async () => {
    try {
      let mediaUrl = [];
      if (newJob.media && isAdmin) {
        const uploadResponse = await feedApi.uploadMedia(newJob.media);
        mediaUrl = [uploadResponse.data.url];
      }

      const jobData = {
        job_title: [newJob.job_title],
        content: newJob.content,
        work_place_name: [newJob.work_place_name],
        job_type: [newJob.job_type],
        cities: [newJob.cities],
        notice_period: parseInt(newJob.notice_period, 10) || 0,
        is_immediate_joiner: newJob.is_immediate_joiner,
        media: mediaUrl,
        status: "pending", // Set initial status to pending
        videoStatus: mediaUrl.length > 0 ? "pending" : undefined,
      };

      const response = await feedApi.create(jobData);
      const newJobWithId = {
        ...jobData,
        _id: response.data._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        noOfReactions: 0,
        authorRole: isAdmin ? "employer" : "candidate",
        videoStatus: mediaUrl.length > 0 ? "pending" : undefined,
      };

      setJobs((prev) => [newJobWithId, ...prev]);
      setCreateDialogOpen(false);
      setNewJob({
        job_title: "",
        content: "",
        work_place_name: "On-site",
        job_type: "Full-time",
        cities: "",
        notice_period: 0,
        is_immediate_joiner: false,
        media: null,
        videoStatus: "pending",
      });
      showSnackbar("Job posted successfully!", "success");
    } catch (error) {
      console.error("Error creating job:", error);
      showSnackbar(`Failed to create job: ${error.message}`, "error");
    }
  };

  const handleEditJob = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    if (job && job.authorRole === "employer" && isAdmin) {
      setNewJob({
        job_title: job.job_title[0] || "",
        content: job.content || "",
        work_place_name: job.work_place_name[0] || "On-site",
        job_type: job.job_type[0] || "Full-time",
        cities: job.cities[0] || "",
        notice_period: job.notice_period || 0,
        is_immediate_joiner: job.is_immediate_joiner || false,
        media: null,
        videoStatus: job.videoStatus || "pending",
      });
      setSelectedJob(job);
      setCreateDialogOpen(true);
    } else {
      showSnackbar(
        job.authorRole !== "employer"
          ? "Only admin-posted jobs can be edited"
          : "Unauthorized to edit job",
        "error"
      );
    }
  };

  const handleAddVideo = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    if (job && job.authorRole === "employer" && isAdmin) {
      setSelectedJob(job);
      setVideoFile(null);
      setVideoDialogOpen(true);
    } else {
      showSnackbar(
        job.authorRole !== "employer"
          ? "Only admin-posted jobs can have videos added"
          : "Unauthorized to add video",
        "error"
      );
    }
  };

  const handleSaveVideo = async () => {
    if (!videoFile) {
      showSnackbar("Please select a video file", "error");
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [selectedJob._id]: true }));
      const uploadResponse = await feedApi.uploadMedia(videoFile);
      const mediaUrl = uploadResponse.data.url;

      const updatedJob = {
        ...selectedJob,
        media: [mediaUrl],
        videoStatus: "pending",
      };
      await feedApi.update(selectedJob._id, {
        media: [mediaUrl],
        videoStatus: "pending",
      });

      setJobs((prev) =>
        prev.map((job) => (job._id === selectedJob._id ? updatedJob : job))
      );
      setVideoDialogOpen(false);
      setSelectedJob(null);
      setVideoFile(null);
      showSnackbar("Video uploaded successfully, pending approval!", "success");
    } catch (error) {
      console.error("Error uploading video:", error);
      showSnackbar(`Failed to upload video: ${error.message}`, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [selectedJob._id]: false }));
    }
  };

  // New functions for approving and rejecting job posts
  const handleApproveJob = async (jobId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [jobId]: true }));
      const job = jobs.find((j) => j._id === jobId);
      if (!job) throw new Error("Job not found");

      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "approved" } : j))
      );

      await feedApi.accept(jobId);
      showSnackbar("Job approved successfully!", "success");
    } catch (error) {
      console.error("Error approving job:", error);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "pending" } : j))
      );
      showSnackbar(`Failed to approve job: ${error.message}`, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [jobId]: true }));
      const job = jobs.find((j) => j._id === jobId);
      if (!job) throw new Error("Job not found");

      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "rejected" } : j))
      );

      await feedApi.reject(jobId);
      showSnackbar("Job rejected successfully!", "success");
    } catch (error) {
      console.error("Error rejecting job:", error);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "pending" } : j))
      );
      showSnackbar(`Failed to reject job: ${error.message}`, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleFileChange = (e, isVideoDialog = false) => {
    const file = e.target.files[0];
    if (file && !["video/mp4", "video/webm", "video/ogg"].includes(file.type)) {
      showSnackbar(
        "Please select a valid video file (MP4, WebM, OGG)",
        "error"
      );
      return;
    }
    if (isVideoDialog) {
      setVideoFile(file);
    } else {
      setNewJob({ ...newJob, media: file });
    }
  };

  // Filter and paginate jobs
  const filteredJobs =
    statusFilter === "All"
      ? jobs
      : jobs.filter((job) => job.status === statusFilter.toLowerCase());

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Full-time":
        return "primary";
      case "Part-time":
        return "secondary";
      case "Internship":
        return "warning";
      default:
        return "default";
    }
  };

  const getVideoStatusColor = (videoStatus) => {
    switch (videoStatus) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Job Posts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover and manage job opportunities
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to page 1 on filter change
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ borderRadius: 2, px: 3 }}
            aria-label="Create new job post"
          >
            Create Job
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading job posts...
          </Typography>
        </Box>
      ) : filteredJobs.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            bgcolor: "grey.100",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No job posts available. Create a new job post to get started.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentJobs.map((job) => (
              <Grid item xs={12} sm={6} lg={4} key={job._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                    borderRadius: 3,
                  }}
                >
                  {job.media.length > 0 && (
                    <Box
                      sx={{
                        position: "relative",
                        height: 200,
                        bgcolor: "grey.200",
                      }}
                    >
                      <video
                        src={job.media[0]}
                        controls
                        preload="metadata"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        component="h2"
                        sx={{ overflowWrap: "break-word" }}
                      >
                        {job.job_title[0]}
                      </Typography>
                      <Chip
                        label={job.status}
                        color={getStatusColor(job.status)}
                        size="small"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <BusinessIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {job.authorRole}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <LocationIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {job.cities[0]}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                    >
                      <Chip
                        label={job.job_type[0]}
                        color={getTypeColor(job.job_type[0])}
                        size="small"
                      />
                      <Chip
                        label={`${job.noOfReactions} reactions`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Notice Period: {job.notice_period} days
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Immediate Joiner: {job.is_immediate_joiner ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      p: 3,
                      pt: 1,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexBasis: "100%",
                        maxWidth: 300,
                      }}
                    >
                      <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewJob(job._id)}
                        sx={{
                          borderRadius: 2,
                          flex: 1,
                          textTransform: "none",
                          "&:hover": { boxShadow: 2 },
                        }}
                        aria-label={`View details of ${job.job_title[0]}`}
                      >
                        View
                      </Button>
                      {job.authorRole === "employer" && isAdmin && (
                        <Button
                          size="medium"
                          variant="contained"
                          color="secondary"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditJob(job._id)}
                          sx={{
                            borderRadius: 2,
                            flex: 1,
                            textTransform: "none",
                            "&:hover": { boxShadow: 2 },
                          }}
                          aria-label={`Edit ${job.job_title[0]}`}
                        >
                          Edit
                        </Button>
                      )}
                    </Box>
                    {isAdmin && job.status === "pending" && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexBasis: "100%",
                          maxWidth: 300,
                        }}
                      >
                        <Button
                          size="medium"
                          variant="outlined"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={() => handleApproveJob(job._id)}
                          disabled={actionLoading[job._id]}
                          sx={{
                            borderRadius: 2,
                            flex: 1,
                            textTransform: "none",
                            padding: actionLoading[job._id] ? 1 : "6px 16px",
                          }}
                        >
                          {actionLoading[job._id] ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                        <Button
                          size="medium"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleRejectJob(job._id)}
                          disabled={actionLoading[job._id]}
                          sx={{
                            borderRadius: 2,
                            flex: 1,
                            textTransform: "none",
                            padding: actionLoading[job._id] ? 1 : "6px 16px",
                          }}
                        >
                          {actionLoading[job._id] ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                      </Box>
                    )}

                    {isAdmin && job.authorRole === "employer" && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexBasis: "100%",
                          maxWidth: 300,
                        }}
                      >
                        <Button
                          size="medium"
                          variant="contained"
                          color="primary"
                          startIcon={<VideoIcon />}
                          onClick={() => handleAddVideo(job._id)}
                          sx={{
                            borderRadius: 2,
                            flex: 1,
                            textTransform: "none",
                            "&:hover": { boxShadow: 2 },
                          }}
                          aria-label={`Add video to ${job.job_title[0]}`}
                        >
                          Add Video
                        </Button>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        </>
      )}

      {/* Job View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Job Details
          </Typography>
          <Button
            onClick={() => setViewDialogOpen(false)}
            startIcon={<CloseIcon />}
            aria-label="Close job details"
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedJob && (
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                {selectedJob.job_title[0]}
              </Typography>

              {selectedJob.media.length > 0 ? (
                <Box
                  sx={{
                    mb: 3,
                    position: "relative",
                    height: 300,
                    bgcolor: "grey.200",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={selectedJob.media[0]}
                    title={`Video for ${selectedJob.job_title[0]}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                  <Chip
                    label={`Video: ${selectedJob.videoStatus}`}
                    color={getVideoStatusColor(selectedJob.videoStatus)}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  No video available for this job.
                </Typography>
              )}

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Author Role
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.authorRole}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.cities[0]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Job Type
                  </Typography>
                  <Chip label={selectedJob.job_type[0]} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Workplace
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.work_place_name[0]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Notice Period
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.notice_period} days
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Immediate Joiner
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.is_immediate_joiner ? "Yes" : "No"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Posted Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedJob.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Reactions
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.noOfReactions}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Status
                  </Typography>
                  <Chip
                    label={selectedJob.status}
                    color={getStatusColor(selectedJob.status)}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Description
              </Typography>
              <Typography variant="body1">
                {selectedJob.content || "No description available"}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Job Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {newJob._id ? "Edit Job Post" : "Create New Job Post"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Job Title"
              value={newJob.job_title}
              onChange={(e) =>
                setNewJob({ ...newJob, job_title: e.target.value })
              }
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Description"
              value={newJob.content}
              onChange={(e) =>
                setNewJob({ ...newJob, content: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
              placeholder="Describe the job..."
              variant="outlined"
            />
            <TextField
              label="City"
              value={newJob.cities}
              onChange={(e) => setNewJob({ ...newJob, cities: e.target.value })}
              fullWidth
              required
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Workplace</InputLabel>
              <Select
                value={newJob.work_place_name}
                label="Workplace"
                onChange={(e) =>
                  setNewJob({ ...newJob, work_place_name: e.target.value })
                }
              >
                <MenuItem value="On-site">On-site</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Job Type</InputLabel>
              <Select
                value={newJob.job_type}
                label="Job Type"
                onChange={(e) =>
                  setNewJob({ ...newJob, job_type: e.target.value })
                }
              >
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notice Period (days)"
              type="number"
              value={newJob.notice_period}
              onChange={(e) =>
                setNewJob({ ...newJob, notice_period: e.target.value })
              }
              fullWidth
              placeholder="e.g., 15"
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Immediate Joiner</InputLabel>
              <Select
                value={newJob.is_immediate_joiner}
                label="Immediate Joiner"
                onChange={(e) =>
                  setNewJob({ ...newJob, is_immediate_joiner: e.target.value })
                }
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
            {isAdmin && (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Upload Video (optional, MP4, WebM, OGG)
                </Typography>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={(e) => handleFileChange(e)}
                  style={{ width: "100%" }}
                />
                {newJob.media && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Selected: {newJob.media.name}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
            aria-label="Cancel job creation"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateJob}
            variant="contained"
            disabled={!newJob.job_title || !newJob.cities}
            sx={{ borderRadius: 2 }}
            aria-label={newJob._id ? "Update job" : "Create job"}
          >
            {newJob._id ? "Update" : "Create"} Job
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Video Dialog */}
      <Dialog
        open={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Add Video to Job Post
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ pt: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Upload Video (MP4, WebM, OGG)
            </Typography>
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              onChange={(e) => handleFileChange(e, true)}
              style={{ width: "100%" }}
            />
            {videoFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected: {videoFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setVideoDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
            aria-label="Cancel video addition"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveVideo}
            variant="contained"
            disabled={!videoFile || actionLoading[selectedJob?._id]}
            sx={{ borderRadius: 2 }}
            aria-label="Save video"
          >
            {actionLoading[selectedJob?._id] ? (
              <CircularProgress size={24} />
            ) : (
              "Save Video"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Posts;
