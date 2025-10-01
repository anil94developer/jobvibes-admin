import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  IconButton,
  Fab,
  Tooltip,
} from "@mui/material";
import {
  VideoCall as VideoIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { userApi } from "../api";

// Fallback data for resumes/profiles
const fallbackResumes = [
  {
    id: 1,
    candidateName: "Alice Johnson",
    position: "Frontend Developer",
    experience: "3 years",
    skills: ["React", "JavaScript", "CSS"],
    hasVideo: true,
    rating: 4.5,
    uploadDate: "2024-02-14",
    status: "Active",
    email: "alice.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    summary:
      "Experienced frontend developer with expertise in React and modern JavaScript frameworks.",
  },
  {
    id: 2,
    candidateName: "Bob Wilson",
    position: "Backend Developer",
    experience: "5 years",
    skills: ["Node.js", "Python", "MongoDB"],
    hasVideo: false,
    rating: 4.2,
    uploadDate: "2024-02-12",
    status: "Active",
    email: "bob.wilson@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    summary:
      "Senior backend developer with strong experience in scalable API development.",
  },
  {
    id: 3,
    candidateName: "Carol Martinez",
    position: "Full Stack Developer",
    experience: "4 years",
    skills: ["React", "Node.js", "PostgreSQL"],
    hasVideo: true,
    rating: 4.8,
    uploadDate: "2024-02-10",
    status: "Featured",
    email: "carol.martinez@example.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    summary:
      "Versatile full-stack developer with expertise in modern web technologies.",
  },
  {
    id: 4,
    candidateName: "David Brown",
    position: "Data Analyst",
    experience: "2 years",
    skills: ["Python", "SQL", "Tableau"],
    hasVideo: true,
    rating: 4.1,
    uploadDate: "2024-02-08",
    status: "Active",
    email: "david.brown@example.com",
    phone: "+1 (555) 456-7890",
    location: "Chicago, IL",
    summary:
      "Detail-oriented data analyst with expertise in statistical analysis and visualization.",
  },
  {
    id: 5,
    candidateName: "Eva Davis",
    position: "UX Designer",
    experience: "6 years",
    skills: ["Figma", "Sketch", "Adobe XD"],
    hasVideo: false,
    rating: 4.7,
    uploadDate: "2024-02-06",
    status: "Active",
    email: "eva.davis@example.com",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA",
    summary:
      "Creative UX designer focused on user-centered design and accessibility.",
  },
  {
    id: 6,
    candidateName: "Frank Miller",
    position: "DevOps Engineer",
    experience: "7 years",
    skills: ["AWS", "Docker", "Kubernetes"],
    hasVideo: true,
    rating: 4.6,
    uploadDate: "2024-02-05",
    status: "Active",
    email: "frank.miller@example.com",
    phone: "+1 (555) 678-9012",
    location: "Denver, CO",
    summary:
      "Expert DevOps engineer specializing in cloud infrastructure and automation.",
  },
];

const Resumes = () => {
  // State management
  const [resumes, setResumes] = useState(fallbackResumes);
  const [filteredResumes, setFilteredResumes] = useState(fallbackResumes);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load resumes data
  useEffect(() => {
    const loadResumes = async () => {
      try {
        setLoading(true);
        const response = await userApi.getAll();
        const rows = response?.data || [];
        if (rows.length) {
          // Transform users to resume cards
          const resumeData = rows.map((user, index) => ({
            ...fallbackResumes[index % fallbackResumes.length],
            id: user.id || user._id || index + 1,
            candidateName:
              user.name ||
              user.user_name ||
              fallbackResumes[index % fallbackResumes.length].candidateName,
            email:
              user.email ||
              fallbackResumes[index % fallbackResumes.length].email,
          }));
          setResumes(resumeData);
          setFilteredResumes(resumeData);
        }
      } catch (error) {
        console.error("Error loading resumes:", error);
        setSnackbar({
          open: true,
          message: "Using offline data - some information may not be current",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResumes(resumes);
      return;
    }

    const filtered = resumes.filter(
      (resume) =>
        resume.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resume.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredResumes(filtered);
  }, [searchTerm, resumes]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Featured":
        return "primary";
      case "Active":
        return "success";
      default:
        return "default";
    }
  };

  const handleViewResume = (resume) => {
    setSelectedResume(resume);
    setViewDialogOpen(true);
  };

  const handleDownloadResume = (resume) => {
    // Simulate download
    setSnackbar({
      open: true,
      message: `Downloading resume for ${resume.candidateName}...`,
      severity: "info",
    });
  };

  const handleViewVideo = (resume) => {
    // Simulate video view
    setSnackbar({
      open: true,
      message: `Opening video interview for ${resume.candidateName}...`,
      severity: "info",
    });
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedResume(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {/* Header with search */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Resumes / Profiles
              {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Candidate resumes (video + text format) - {filteredResumes.length}{" "}
              profiles
            </Typography>
          </Box>
          <Fab
            color="primary"
            size="medium"
            sx={{ boxShadow: 2 }}
            onClick={() =>
              setSnackbar({
                open: true,
                message: "Add Resume feature coming soon!",
                severity: "info",
              })
            }
          >
            <Tooltip title="Add Resume">
              <AddIcon />
            </Tooltip>
          </Fab>
        </Box>

        {/* Search bar */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search by name, position, or skills..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              ),
            }}
            sx={{ minWidth: 300, flexGrow: 1 }}
          />
        </Box>
      </Box>

      {/* Resumes Grid */}
      <Grid container spacing={3}>
        {filteredResumes.map((resume) => (
          <Grid item xs={12} md={6} lg={4} key={resume.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {resume.candidateName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2">
                        {resume.candidateName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {resume.position}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={resume.status}
                    color={getStatusColor(resume.status)}
                    size="small"
                  />
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <StarIcon sx={{ fontSize: 16, color: "#ffc107" }} />
                  <Typography variant="body2">
                    {resume.rating} • {resume.experience} experience
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Skills:
                </Typography>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}
                >
                  {resume.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Uploaded: {resume.uploadDate}
                </Typography>
              </CardContent>

              <CardActions sx={{ padding: 2, pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<ViewIcon />}
                  color="primary"
                  onClick={() => handleViewResume(resume)}
                >
                  View
                </Button>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  color="secondary"
                  onClick={() => handleDownloadResume(resume)}
                >
                  Download
                </Button>
                {resume.hasVideo && (
                  <Button
                    size="small"
                    startIcon={<VideoIcon />}
                    color="success"
                    onClick={() => handleViewVideo(resume)}
                  >
                    Video
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* View Resume Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Resume Details - {selectedResume?.candidateName}
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedResume && (
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "primary.main",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      {selectedResume.candidateName.charAt(0)}
                    </Avatar>
                    <Typography variant="h6">
                      {selectedResume.candidateName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedResume.position}
                    </Typography>
                    <Chip
                      label={selectedResume.status}
                      color={getStatusColor(selectedResume.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {selectedResume.email}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {selectedResume.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    <strong>Location:</strong> {selectedResume.location}
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    {selectedResume.summary}
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Experience & Rating
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    <StarIcon sx={{ color: "#ffc107" }} />
                    <Typography variant="body2">
                      {selectedResume.rating}/5.0 • {selectedResume.experience}{" "}
                      of experience
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Skills
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}
                  >
                    {selectedResume.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDownloadResume(selectedResume)}
            startIcon={<DownloadIcon />}
            color="secondary"
          >
            Download Resume
          </Button>
          {selectedResume?.hasVideo && (
            <Button
              onClick={() => handleViewVideo(selectedResume)}
              startIcon={<VideoIcon />}
              color="success"
            >
              Watch Video
            </Button>
          )}
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default Resumes;
