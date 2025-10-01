import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { applicationApi } from "../api";

// Fallback data for candidate applications
const fallbackMatches = [
  {
    id: 1,
    candidateName: "Alice Johnson",
    jobTitle: "Senior React Developer",
    company: "Tech Solutions Inc.",
    appliedDate: "2024-02-15",
    status: "Under Review",
    matchScore: 85,
    interviewScheduled: false,
    candidateEmail: "alice.johnson@example.com",
    experience: "3 years",
    skills: ["React", "JavaScript", "CSS"],
  },
  {
    id: 2,
    candidateName: "Bob Wilson",
    jobTitle: "Backend Developer",
    company: "DevCorp Ltd.",
    appliedDate: "2024-02-14",
    status: "Interview Scheduled",
    matchScore: 92,
    interviewScheduled: true,
    candidateEmail: "bob.wilson@example.com",
    experience: "5 years",
    skills: ["Node.js", "Python", "MongoDB"],
  },
  {
    id: 3,
    candidateName: "Carol Martinez",
    jobTitle: "Full Stack Developer",
    company: "Innovation Corp.",
    appliedDate: "2024-02-13",
    status: "Shortlisted",
    matchScore: 78,
    interviewScheduled: false,
    candidateEmail: "carol.martinez@example.com",
    experience: "4 years",
    skills: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: 4,
    candidateName: "David Brown",
    jobTitle: "Data Analyst",
    company: "Analytics Pro",
    appliedDate: "2024-02-12",
    status: "Rejected",
    matchScore: 65,
    interviewScheduled: false,
    candidateEmail: "david.brown@example.com",
    experience: "2 years",
    skills: ["Python", "SQL", "Tableau"],
  },
  {
    id: 5,
    candidateName: "Eva Davis",
    jobTitle: "UX Designer",
    company: "Creative Agency Ltd.",
    appliedDate: "2024-02-11",
    status: "Hired",
    matchScore: 94,
    interviewScheduled: false,
    candidateEmail: "eva.davis@example.com",
    experience: "6 years",
    skills: ["Figma", "Sketch", "Adobe XD"],
  },
  {
    id: 6,
    candidateName: "Frank Miller",
    jobTitle: "DevOps Engineer",
    company: "Cloud Systems Inc.",
    appliedDate: "2024-02-10",
    status: "Under Review",
    matchScore: 88,
    interviewScheduled: false,
    candidateEmail: "frank.miller@example.com",
    experience: "7 years",
    skills: ["AWS", "Docker", "Kubernetes"],
  },
];

const Matches = () => {
  // State management
  const [matches, setMatches] = useState(fallbackMatches);
  const [filteredMatches, setFilteredMatches] = useState(fallbackMatches);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load matches data
  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const response = await applicationApi.getAllApplications();
        if (response?.data) {
          // Transform application data to match format
          const matchData = response.data.map((app, index) => ({
            ...fallbackMatches[index % fallbackMatches.length],
            id: app.id || index + 1,
            candidateName:
              app.candidateName ||
              fallbackMatches[index % fallbackMatches.length].candidateName,
            jobTitle:
              app.jobTitle ||
              fallbackMatches[index % fallbackMatches.length].jobTitle,
            status:
              app.status ||
              fallbackMatches[index % fallbackMatches.length].status,
          }));
          setMatches(matchData);
          setFilteredMatches(matchData);
        }
      } catch (error) {
        console.error("Error loading matches:", error);
        setSnackbar({
          open: true,
          message: "Using offline data - some information may not be current",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // Filter functionality
  useEffect(() => {
    let filtered = matches;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (match) =>
          match.candidateName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          match.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((match) => match.status === statusFilter);
    }

    setFilteredMatches(filtered);
  }, [searchTerm, statusFilter, matches]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Hired":
        return "success";
      case "Interview Scheduled":
        return "info";
      case "Shortlisted":
        return "primary";
      case "Under Review":
        return "warning";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "success";
    if (score >= 75) return "info";
    if (score >= 60) return "warning";
    return "error";
  };

  const handleViewMatch = (match) => {
    setSelectedMatch(match);
    setViewDialogOpen(true);
  };

  const handleSendMessage = (match) => {
    setSelectedMatch(match);
    setMessageDialogOpen(true);
  };

  const handleScheduleInterview = (match) => {
    setSelectedMatch(match);
    setScheduleDialogOpen(true);
  };

  const handleSendMessageConfirm = () => {
    setSnackbar({
      open: true,
      message: `Message sent to ${selectedMatch?.candidateName}`,
      severity: "success",
    });
    setMessageDialogOpen(false);
    setMessageText("");
  };

  const handleScheduleConfirm = () => {
    // Update the match status
    const updatedMatches = matches.map((match) =>
      match.id === selectedMatch.id
        ? { ...match, status: "Interview Scheduled", interviewScheduled: true }
        : match
    );
    setMatches(updatedMatches);

    setSnackbar({
      open: true,
      message: `Interview scheduled with ${selectedMatch?.candidateName}`,
      severity: "success",
    });
    setScheduleDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setMessageDialogOpen(false);
    setScheduleDialogOpen(false);
    setSelectedMatch(null);
    setMessageText("");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const statusOptions = [
    "All",
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Hired",
    "Rejected",
  ];

  return (
    <Box>
      {/* Header with filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Matches
          {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Track candidate applications for jobs - {filteredMatches.length}{" "}
          matches
        </Typography>

        {/* Search and Filter Bar */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search candidates, jobs, or companies..."
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
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}
              startAdornment={<FilterIcon sx={{ mr: 1 }} />}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Job Position</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Match Score</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMatches.map((match) => (
              <TableRow
                key={match.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                    >
                      {match.candidateName.charAt(0)}
                    </Avatar>
                    {match.candidateName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {match.jobTitle}
                  </Typography>
                </TableCell>
                <TableCell>{match.company}</TableCell>
                <TableCell>{match.appliedDate}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={match.status}
                      color={getStatusColor(match.status)}
                      size="small"
                    />
                    {match.interviewScheduled && (
                      <ScheduleIcon sx={{ fontSize: 16, color: "info.main" }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 100,
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={match.matchScore}
                      color={getScoreColor(match.matchScore)}
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="body2" sx={{ minWidth: 35 }}>
                      {match.matchScore}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleViewMatch(match)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => handleSendMessage(match)}
                  >
                    <MessageIcon />
                  </IconButton>
                  {!match.interviewScheduled &&
                    (match.status === "Shortlisted" ||
                      match.status === "Under Review") && (
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleScheduleInterview(match)}
                      >
                        <ScheduleIcon />
                      </IconButton>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Match Dialog */}
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
            Match Details - {selectedMatch?.candidateName}
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMatch && (
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Candidate Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedMatch.candidateName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedMatch.candidateEmail}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Experience:</strong> {selectedMatch.experience}
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Skills
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {selectedMatch.skills?.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Job Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Position:</strong> {selectedMatch.jobTitle}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Company:</strong> {selectedMatch.company}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Applied:</strong> {selectedMatch.appliedDate}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Match Analysis
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Match Score:</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={selectedMatch.matchScore}
                      color={getScoreColor(selectedMatch.matchScore)}
                      sx={{ width: 100, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {selectedMatch.matchScore}%
                    </Typography>
                  </Box>

                  <Chip
                    label={selectedMatch.status}
                    color={getStatusColor(selectedMatch.status)}
                    sx={{ mt: 2 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleSendMessage(selectedMatch)}
            startIcon={<MessageIcon />}
            color="secondary"
          >
            Send Message
          </Button>
          {selectedMatch &&
            !selectedMatch.interviewScheduled &&
            (selectedMatch.status === "Shortlisted" ||
              selectedMatch.status === "Under Review") && (
              <Button
                onClick={() => handleScheduleInterview(selectedMatch)}
                startIcon={<ScheduleIcon />}
                color="info"
              >
                Schedule Interview
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

      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Message to {selectedMatch?.candidateName}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSendMessageConfirm}
            color="primary"
            variant="contained"
            disabled={!messageText.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Schedule Interview with {selectedMatch?.candidateName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Are you sure you want to schedule an interview with this candidate?
            This will update their status to &quot;Interview Scheduled&quot;.
          </Typography>
          <TextField
            margin="dense"
            label="Interview Notes (Optional)"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            placeholder="Add any notes about the interview..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleScheduleConfirm}
            color="info"
            variant="contained"
          >
            Schedule Interview
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

export default Matches;
