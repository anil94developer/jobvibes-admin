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
} from "@mui/material";
import {
  Add as AddIcon,
  VideoCall as VideoIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { jobApi } from "../api";

// Fallback job posts data
const fallbackJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "Tech Solutions Inc.",
    location: "New York, NY",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    postedDate: "2024-02-15",
    status: "Active",
    applicants: 15,
    description: "Looking for an experienced React developer to join our team.",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Creative Agency Ltd.",
    location: "San Francisco, CA",
    type: "Contract",
    salary: "$70,000 - $90,000",
    postedDate: "2024-02-10",
    status: "Active",
    applicants: 8,
    description: "Creative UX/UI designer needed for innovative projects.",
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Innovation Corp.",
    location: "Remote",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    postedDate: "2024-02-08",
    status: "Closed",
    applicants: 23,
    description: "Lead product development and strategy initiatives.",
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Chicago, IL",
    type: "Part-time",
    salary: "$60,000 - $80,000",
    postedDate: "2024-02-12",
    status: "Active",
    applicants: 12,
    description: "Analyze data to drive business insights and decisions.",
  },
];

const Posts = () => {
  // State management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
  });

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await jobApi.getAll();
        setJobs(response?.data || response || []);
      } catch (error) {
        console.log("API not available, using fallback data:", error);
        setJobs(fallbackJobs);
        showSnackbar("Using demo data - API not connected", "info");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Utility functions
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewJob = async (jobId) => {
    try {
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        setSelectedJob(job);
        setViewDialogOpen(true);
      }
    } catch (error) {
      showSnackbar("Failed to load job details", "error");
    }
  };

  const handleCreateJob = async () => {
    try {
      // In real implementation, this would call the API
      const jobWithId = {
        ...newJob,
        id: Date.now(), // Temporary ID for demo
        postedDate: new Date().toISOString().split("T")[0],
        status: "Active",
        applicants: 0,
      };

      setJobs((prev) => [jobWithId, ...prev]);
      setCreateDialogOpen(false);
      setNewJob({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
      });
      showSnackbar("Job posted successfully!", "success");
    } catch (error) {
      showSnackbar("Failed to create job", "error");
    }
  };

  const handleEditJob = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setNewJob(job);
      setCreateDialogOpen(true);
    }
  };

  // Mock data for job posts (keeping for fallback)
  const jobPosts =
    jobs.length > 0
      ? jobs
      : [
          {
            id: 1,
            title: "Senior React Developer",
            company: "Tech Solutions Inc.",
            location: "New York, NY",
            type: "Full-time",
            salary: "$80,000 - $120,000",
            postedDate: "2024-02-15",
            status: "Active",
            applicants: 15,
          },
          {
            id: 2,
            title: "UX/UI Designer",
            company: "Creative Agency Ltd.",
            location: "San Francisco, CA",
            type: "Contract",
            salary: "$70,000 - $90,000",
            postedDate: "2024-02-10",
            status: "Active",
            applicants: 8,
          },
          {
            id: 3,
            title: "Product Manager",
            company: "Innovation Corp.",
            location: "Remote",
            type: "Full-time",
            salary: "$100,000 - $140,000",
            postedDate: "2024-02-08",
            status: "Closed",
            applicants: 23,
          },
          {
            id: 4,
            title: "Data Scientist",
            company: "Analytics Pro",
            location: "Chicago, IL",
            type: "Part-time",
            salary: "$60,000 - $80,000",
            postedDate: "2024-02-12",
            status: "Active",
            applicants: 12,
          },
        ];

  const getStatusColor = (status) => {
    return status === "Active" ? "success" : "error";
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Full-time":
        return "primary";
      case "Part-time":
        return "secondary";
      case "Contract":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Posts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload job & resume as video
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" startIcon={<VideoIcon />}>
            Upload Video Resume
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Job Post
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
      ) : (
        <Grid container spacing={3}>
          {jobPosts.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography gutterBottom variant="h6" component="h2">
                      {job.title}
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
                    <BusinessIcon sx={{ fontSize: 16 }} color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {job.company}
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
                    <LocationIcon sx={{ fontSize: 16 }} color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {job.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Chip
                      label={job.type}
                      color={getTypeColor(job.type)}
                      size="small"
                    />
                    <Chip
                      label={`${job.applicants} applicants`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {job.salary}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Posted: {job.postedDate}
                  </Typography>
                </CardContent>

                <CardActions sx={{ padding: 2, pt: 0 }}>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewJob(job.id)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditJob(job.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<VideoIcon />}
                    onClick={() =>
                      showSnackbar("Video upload feature coming soon!", "info")
                    }
                  >
                    Video
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Job View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Job Details</Typography>
          <Button
            onClick={() => setViewDialogOpen(false)}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedJob.title}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Company
                  </Typography>
                  <Typography variant="body1">{selectedJob.company}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.location}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Chip label={selectedJob.type} size="small" />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Salary
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary.main"
                    sx={{ fontWeight: 600 }}
                  >
                    {selectedJob.salary}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Posted Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.postedDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Applicants
                  </Typography>
                  <Typography variant="body1">
                    {selectedJob.applicants}
                  </Typography>
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
                {selectedJob.description || "No description available"}
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
      >
        <DialogTitle>
          {newJob.id ? "Edit Job Post" : "Create New Job Post"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Company"
              value={newJob.company}
              onChange={(e) =>
                setNewJob({ ...newJob, company: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Location"
              value={newJob.location}
              onChange={(e) =>
                setNewJob({ ...newJob, location: e.target.value })
              }
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Job Type</InputLabel>
              <Select
                value={newJob.type}
                label="Job Type"
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
              >
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Salary Range"
              value={newJob.salary}
              onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
              fullWidth
              placeholder="e.g., $60,000 - $80,000"
            />
            <TextField
              label="Job Description"
              value={newJob.description}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
              placeholder="Describe the job requirements and responsibilities..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateJob}
            variant="contained"
            disabled={!newJob.title || !newJob.company}
          >
            {newJob.id ? "Update" : "Create"} Job
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Posts;
