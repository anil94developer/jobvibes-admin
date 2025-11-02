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
  Checkbox,
  ListItemText,
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
import { feedApi, stateCityApi } from "../api";

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
    state: [], // Array for multi-select states
    city: [], // Array for multi-select cities
    notice_period: 0,
    is_immediate_joiner: false,
    media: null,
    videoStatus: "pending",
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [statePage, setStatePage] = useState(1);
  const [cityPage, setCityPage] = useState(1);
  const itemsPerPage = 10;
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

  // Allowed/maintained statuses
  const VALID_STATUSES = ["approved", "rejected", "pending"];

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await stateCityApi.getStates();
        setStates(response?.data || []);
      } catch (error) {
        console.error("Error fetching states:", error);
        showSnackbar("Failed to fetch states", "error");
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when states are selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!newJob.state || newJob.state.length === 0) {
        setCities([]);
        setNewJob((prev) => ({ ...prev, city: [] }));
        return;
      }

      try {
        setLoadingCities(true);
        // Fetch cities for all selected states
        const cityPromises = newJob.state.map((stateId) =>
          stateCityApi.getCities(stateId)
        );
        const responses = await Promise.all(cityPromises);

        // Combine all cities from all selected states
        const allCities = [];
        const cityMap = new Map(); // Use Map to avoid duplicates

        responses.forEach((response) => {
          const citiesData = response?.data?.results || response?.data || [];
          citiesData.forEach((city) => {
            // Use _id as key to avoid duplicates
            if (!cityMap.has(city._id)) {
              cityMap.set(city._id, city);
              allCities.push(city);
            }
          });
        });

        setCities(allCities);
        setCityPage(1); // Reset city page when cities are loaded
      } catch (error) {
        console.error("Error fetching cities:", error);
        showSnackbar("Failed to fetch cities", "error");
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [newJob.state]);

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

        // Normalize statuses
        const normalizedJobs = data.map((job) => {
          const rawStatus = job?.status
            ? String(job.status).toLowerCase()
            : "pending";
          const normalizedStatus = VALID_STATUSES.includes(rawStatus)
            ? rawStatus
            : "pending";

          const rawVideoStatus = job?.videoStatus
            ? String(job.videoStatus).toLowerCase()
            : "pending";
          const normalizedVideoStatus = VALID_STATUSES.includes(rawVideoStatus)
            ? rawVideoStatus
            : "pending";

          return {
            ...job,
            status: normalizedStatus,
            videoStatus:
              job?.media?.length > 0 ? normalizedVideoStatus : undefined,
          };
        });

        setJobs(normalizedJobs);
        setTotalPages(pagination.totalPages || 1); // Use server-provided totalPages
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
  }, [currentPage, statusFilter]); // Remove jobsPerPage, VALID_STATUSES from deps

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
      // Get state names from selected state IDs
      const selectedStateNames = states
        .filter((s) => newJob.state.includes(s._id))
        .map((s) => s.name);

      // Get city names from selected city IDs
      const selectedCityNames = cities
        .filter((c) => newJob.city.includes(c._id))
        .map((c) => c.name);

      const jobData = {
        job_title: [newJob.job_title],
        content: newJob.content,
        work_place_name: [newJob.work_place_name],
        job_type: [newJob.job_type],
        cities: selectedCityNames, // Array of city names
        states: selectedStateNames, // Array of state names
        notice_period: parseInt(newJob.notice_period, 10) || 0,
        is_immediate_joiner: newJob.is_immediate_joiner,
        // If a File is present, the API layer will send multipart as "media"
        media: newJob.media || undefined,
        status: "pending",
      };

      let response;
      if (newJob._id) {
        // Update existing post
        response = await feedApi.update(newJob._id, jobData);
      } else {
        // Create new post
        response = await feedApi.create(jobData);
      }
      const created = response?.data || {};
      const newJobWithId = {
        ...created,
        // Normalize fields for UI if backend returns arrays/values
        job_title: created.job_title || [newJob.job_title],
        work_place_name: created.work_place_name || [newJob.work_place_name],
        job_type: created.job_type || [newJob.job_type],
        cities: created.cities || selectedCityNames,
        states: created.states || selectedStateNames,
        media: Array.isArray(created.media) ? created.media : [],
        status: created.status || "pending",
        videoStatus:
          created.media && created.media.length > 0 ? "pending" : undefined,
        noOfReactions: created.noOfReactions ?? 0,
        authorRole: created.authorRole || (isAdmin ? "employer" : "candidate"),
      };

      if (newJob._id) {
        // Update existing job in the list
        setJobs((prev) =>
          prev.map((j) => (j._id === newJob._id ? newJobWithId : j))
        );
        showSnackbar("Job updated successfully!", "success");
      } else {
        // Add new job to the list
        setJobs((prev) => [newJobWithId, ...prev]);
        showSnackbar("Job posted successfully!", "success");
      }

      setCreateDialogOpen(false);
      setNewJob({
        job_title: "",
        content: "",
        work_place_name: "On-site",
        job_type: "Full-time",
        cities: "",
        state: [],
        city: [],
        notice_period: 0,
        is_immediate_joiner: false,
        media: null,
        videoStatus: "pending",
      });
      setCities([]);
    } catch (error) {
      console.error("Error creating job:", error);
      showSnackbar(`Failed to create job: ${error.message}`, "error");
    }
  };

  const handleEditJob = async (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    // Only allow editing if: job exists, job was created by admin (authorRole === "employer"), and current user is admin
    if (job && isAdmin && job.authorRole === "admin") {
      // Find the state IDs from the state names
      const stateNames =
        Array.isArray(job.states) && job.states.length > 0 ? job.states : [];

      const stateIds = stateNames
        .map((stateName) => {
          const matchedState = states.find((s) => s.name === stateName);
          return matchedState ? matchedState._id : null;
        })
        .filter(Boolean);

      // Find city IDs from city names
      const cityNames = Array.isArray(job.cities) ? job.cities : [];
      let cityIds = [];

      // If we have states selected, fetch cities for all states and match by name
      if (stateIds.length > 0) {
        try {
          setLoadingCities(true);
          // Fetch cities for all states
          const cityPromises = stateIds.map((stateId) =>
            stateCityApi.getCities(stateId)
          );
          const responses = await Promise.all(cityPromises);

          // Combine all cities from all states
          const allCities = [];
          const cityMap = new Map();

          responses.forEach((response) => {
            const citiesData = response?.data?.results || response?.data || [];
            citiesData.forEach((city) => {
              if (!cityMap.has(city._id)) {
                cityMap.set(city._id, city);
                allCities.push(city);
              }
            });
          });

          setCities(allCities);

          // Match city names to IDs
          cityIds = cityNames
            .map((cityName) => {
              const matchedCity = allCities.find((c) => c.name === cityName);
              return matchedCity ? matchedCity._id : null;
            })
            .filter(Boolean);
        } catch (error) {
          console.error("Error fetching cities for edit:", error);
          setCities([]);
        } finally {
          setLoadingCities(false);
        }
      }

      setNewJob({
        _id: job._id,
        job_title: Array.isArray(job.job_title)
          ? job.job_title[0] || ""
          : job.job_title || "",
        content: job.content || "",
        work_place_name: Array.isArray(job.work_place_name)
          ? job.work_place_name[0] || "On-site"
          : job.work_place_name || "On-site",
        job_type: Array.isArray(job.job_type)
          ? job.job_type[0] || "Full-time"
          : job.job_type || "Full-time",
        state: stateIds,
        city: cityIds,
        cities: "", // Keep for backward compatibility
        notice_period: job.notice_period || 0,
        is_immediate_joiner: job.is_immediate_joiner || false,
        media: null,
        videoStatus: job.videoStatus || "pending",
      });
      setStatePage(1);
      setCityPage(1);
      setSelectedJob(job);
      setCreateDialogOpen(true);
    } else {
      if (!isAdmin) {
        showSnackbar("Unauthorized: Only admins can edit posts", "error");
      } else if (job && job.authorRole !== "admin") {
        showSnackbar("Only admin-created posts can be edited", "error");
      } else {
        showSnackbar("Job not found or cannot be edited", "error");
      }
    }
  };

  const handleAddVideo = (jobId) => {
    const job = jobs.find((j) => j._id === jobId);
    // allow only for admin + no existing media
    if (
      job &&
      (job.media?.length === 0 || job.media === undefined) &&
      isAdmin
    ) {
      // create a hidden file input to trigger native file picker
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/mp4,video/webm,video/ogg";
      input.onchange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
          showSnackbar("No file selected", "error");
          return;
        }
        if (!["video/mp4", "video/webm", "video/ogg"].includes(file.type)) {
          showSnackbar(
            "Please select a valid video file (MP4, WebM, OGG)",
            "error"
          );
          return;
        }

        try {
          setActionLoading((prev) => ({ ...prev, [jobId]: true }));

          // upload to Cloudinary (via feedApi)
          const uploadResponse = await feedApi.uploadVideo(jobId, file);
          const mediaUrl = uploadResponse?.data?.[0]?.url;
          if (!mediaUrl) throw new Error("Upload did not return a media URL");

          // save url to feed
          await feedApi.update(jobId, {
            media: [mediaUrl],
            videoStatus: "pending",
          });

          // update local state
          setJobs((prev) =>
            prev.map((j) =>
              j._id === jobId
                ? { ...j, media: [mediaUrl], videoStatus: "pending" }
                : j
            )
          );

          showSnackbar(
            "Video uploaded successfully, pending approval!",
            "success"
          );
        } catch (error) {
          console.error("Error uploading video:", error);
          showSnackbar(
            `Failed to upload video: ${error.message || error}`,
            "error"
          );
        } finally {
          setActionLoading((prev) => ({ ...prev, [jobId]: false }));
        }
      };

      // trigger file picker
      input.click();
    } else {
      showSnackbar(
        job?.authorRole !== "employer"
          ? "Only admin-posted jobs can have videos added"
          : "Unauthorized to add video",
        "error"
      );
    }
  };

  const handleSaveVideo = async (jobId) => {
    if (!jobId) {
      showSnackbar("No job selected", "error");
      return;
    }
    if (!videoFile) {
      showSnackbar("Please select a video file", "error");
      return;
    }
    try {
      setActionLoading((prev) => ({ ...prev, [jobId]: true }));

      // upload video
      const uploadResponse = await feedApi.uploadVideo(jobId, videoFile);
      const mediaUrl = uploadResponse?.data?.[0]?.url;
      if (!mediaUrl) throw new Error("Upload did not return a media URL");

      // save url to feed
      await feedApi.update(jobId, {
        media: [mediaUrl],
        videoStatus: "pending",
      });

      // update local state
      setJobs((prev) =>
        prev.map((j) =>
          j._id === jobId
            ? { ...j, media: [mediaUrl], videoStatus: "pending" }
            : j
        )
      );

      // cleanup and UI
      setVideoDialogOpen(false);
      setSelectedJob(null);
      setVideoFile(null);
      showSnackbar("Video uploaded successfully, pending approval!", "success");
    } catch (error) {
      console.error("Error uploading video:", error);
      showSnackbar(
        `Failed to upload video: ${error.message || error}`,
        "error"
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [jobId]: false }));
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

  // Already paginated and filtered by server
  const currentJobs = jobs;

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
              {VALID_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </MenuItem>
              ))}
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
      ) : jobs.length === 0 ? (
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
                    borderRadius: 2,
                  }}
                >
                  {job?.media?.length > 0 && (
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
                        {Array.isArray(job.job_title)
                          ? job.job_title[0]
                          : job.job_title}
                      </Typography>
                      <Chip
                        label={
                          job.status
                            ? job.status.charAt(0).toUpperCase() +
                              job.status.slice(1)
                            : "Unknown"
                        }
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
                        {Array.isArray(job.cities) ? job.cities[0] : job.cities}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                    >
                      <Chip
                        label={
                          Array.isArray(job.job_type)
                            ? job.job_type[0]
                            : job.job_type
                        }
                        color={getTypeColor(
                          Array.isArray(job.job_type)
                            ? job.job_type[0]
                            : job.job_type
                        )}
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
                        aria-label={`View details of ${
                          Array.isArray(job.job_title)
                            ? job.job_title[0]
                            : job.job_title
                        }`}
                      >
                        View
                      </Button>
                      {/* Only show Edit button for admin-created posts (authorRole === "employer") when user is admin */}
                      {isAdmin && job.authorRole === "admin" && (
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
                          aria-label={`Edit ${
                            Array.isArray(job.job_title)
                              ? job.job_title[0]
                              : job.job_title
                          }`}
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

                    {isAdmin && job.media?.length === 0 && (
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
                          startIcon={
                            actionLoading[job._id] ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <VideoIcon />
                            )
                          }
                          onClick={() => handleAddVideo(job._id)}
                          disabled={actionLoading[job._id]}
                          sx={{
                            borderRadius: 2,
                            flex: 1,
                            textTransform: "none",
                            padding: actionLoading[job._id] ? 1 : "6px 16px",
                            "&:hover": { boxShadow: 2 },
                          }}
                          aria-label={`Add video to ${
                            Array.isArray(job.job_title)
                              ? job.job_title[0]
                              : job.job_title
                          }`}
                        >
                          {actionLoading[job._id]
                            ? "Uploading..."
                            : "Add Video"}
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
                {Array.isArray(selectedJob.job_title)
                  ? selectedJob.job_title[0]
                  : selectedJob.job_title}
              </Typography>

              {selectedJob?.media?.length > 0 ? (
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
                    title={`Video for ${
                      Array.isArray(selectedJob.job_title)
                        ? selectedJob.job_title[0]
                        : selectedJob.job_title
                    }`}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
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
                    {Array.isArray(selectedJob.cities)
                      ? selectedJob.cities[0]
                      : selectedJob.cities}
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
                  <Chip
                    label={
                      Array.isArray(selectedJob.job_type)
                        ? selectedJob.job_type[0]
                        : selectedJob.job_type
                    }
                    size="small"
                  />
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
                    {Array.isArray(selectedJob.work_place_name)
                      ? selectedJob.work_place_name[0]
                      : selectedJob.work_place_name}
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
                    label={
                      selectedJob.status
                        ? selectedJob.status.charAt(0).toUpperCase() +
                          selectedJob.status.slice(1)
                        : "Unknown"
                    }
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
        onClose={() => {
          setCreateDialogOpen(false);
          // Reset form when dialog closes
          setNewJob({
            job_title: "",
            content: "",
            work_place_name: "On-site",
            job_type: "Full-time",
            cities: "",
            state: [],
            city: [],
            notice_period: 0,
            is_immediate_joiner: false,
            media: null,
            videoStatus: "pending",
          });
          setCities([]);
          setStatePage(1);
          setCityPage(1);
        }}
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
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>States</InputLabel>
              <Select
                multiple
                value={newJob.state}
                label="States"
                onChange={(e) => {
                  const value =
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value;
                  setNewJob({ ...newJob, state: value, city: [] });
                  setCityPage(1); // Reset city page when states change
                }}
                renderValue={(selected) => {
                  if (!selected || selected.length === 0) {
                    return <em>Select states</em>;
                  }
                  return selected
                    .map(
                      (stateId) => states.find((s) => s._id === stateId)?.name
                    )
                    .filter(Boolean)
                    .join(", ");
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                    onScroll: (e) => {
                      const { scrollTop, scrollHeight, clientHeight } =
                        e.target;
                      // Load more when user scrolls near the bottom (within 50px)
                      if (
                        scrollHeight - scrollTop <= clientHeight + 50 &&
                        states.length > statePage * itemsPerPage
                      ) {
                        // Small delay to prevent rapid firing
                        setTimeout(() => {
                          setStatePage((prev) => prev + 1);
                        }, 300);
                      }
                    },
                  },
                }}
              >
                {states.slice(0, statePage * itemsPerPage).map((state) => (
                  <MenuItem key={state._id} value={state._id}>
                    <Checkbox checked={newJob.state.includes(state._id)} />
                    <ListItemText primary={state.name} />
                  </MenuItem>
                ))}
                {states.length > statePage * itemsPerPage && (
                  <MenuItem disabled>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        py: 1,
                      }}
                    >
                      <CircularProgress size={20} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Loading more...
                      </Typography>
                    </Box>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>City</InputLabel>
              <Select
                multiple
                value={newJob.city}
                label="City"
                onChange={(e) => {
                  const value =
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value;
                  setNewJob({ ...newJob, city: value });
                }}
                disabled={
                  !newJob.state || newJob.state.length === 0 || loadingCities
                }
                renderValue={(selected) => {
                  if (!selected || selected.length === 0) {
                    return <em>Select cities</em>;
                  }
                  return selected
                    .map((cityId) => cities.find((c) => c._id === cityId)?.name)
                    .filter(Boolean)
                    .join(", ");
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                    onScroll: (e) => {
                      const { scrollTop, scrollHeight, clientHeight } =
                        e.target;
                      // Load more when user scrolls near the bottom (within 50px)
                      if (
                        scrollHeight - scrollTop <= clientHeight + 50 &&
                        cities.length > cityPage * itemsPerPage
                      ) {
                        // Small delay to prevent rapid firing
                        setTimeout(() => {
                          setCityPage((prev) => prev + 1);
                        }, 300);
                      }
                    },
                  },
                }}
              >
                {cities.slice(0, cityPage * itemsPerPage).map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    <Checkbox checked={newJob.city.includes(city._id)} />
                    <ListItemText primary={city.name} />
                  </MenuItem>
                ))}
                {cities.length > cityPage * itemsPerPage && (
                  <MenuItem disabled>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        py: 1,
                      }}
                    >
                      <CircularProgress size={20} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Loading more...
                      </Typography>
                    </Box>
                  </MenuItem>
                )}
              </Select>
              {loadingCities && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Loading cities...
                  </Typography>
                </Box>
              )}
            </FormControl>
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
            disabled={
              !newJob.job_title ||
              !newJob.state ||
              newJob.state.length === 0 ||
              newJob.city.length === 0
            }
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
        sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}
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
            onClick={() => handleSaveVideo(selectedJob?._id)}
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
