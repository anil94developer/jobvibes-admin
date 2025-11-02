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
  Pagination,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { applicationApi } from "../api";

const Matches = () => {
  // State management
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);
  const matchesPerPage = 10;

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load matches data from API
  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: matchesPerPage,
        };

        // Add search parameter if provided
        if (debouncedSearchTerm.trim()) {
          params.search = debouncedSearchTerm.trim();
        }

        // Add status filter if not "All"
        if (statusFilter !== "All") {
          params.status = statusFilter.toLowerCase();
        }

        // Use the matches endpoint specifically for candidates who applied for jobs
        const response = await applicationApi.getMatches(params);
        const data = response?.data?.results || response?.data || [];
        const pagination = response?.data?.pagination || {};

        // Transform API data to match format
        // Applications contain: userId (candidate), feedId (job), status, etc.
        const matchData = data.map((app) => {
          // Handle different possible structures from the API
          const candidate = app.user || app.userId || app.candidate || {};
          const job = app.feed || app.feedId || app.job || {};

          // Extract job title - handle array format
          const jobTitle = job.job_title
            ? Array.isArray(job.job_title)
              ? job.job_title[0]
              : job.job_title
            : job.title || "Unknown Position";

          return {
            id: app._id || app.id,
            candidateName:
              candidate.name ||
              candidate.fullName ||
              candidate.username ||
              app.candidateName ||
              "Unknown Candidate",
            candidateEmail: candidate.email || app.candidateEmail || "",
            profileImage:
              candidate.profile_image ||
              candidate.profileImage ||
              app.profile_image ||
              app.profileImage ||
              null,
            jobTitle: jobTitle,
            company:
              job.company ||
              job.work_place_name ||
              (Array.isArray(job.work_place_name)
                ? job.work_place_name[0]
                : job.work_place_name) ||
              "Unknown Company",
            appliedDate: app.createdAt
              ? new Date(app.createdAt).toLocaleDateString()
              : app.appliedDate
              ? new Date(app.appliedDate).toLocaleDateString()
              : "N/A",
            status: app.status || (app.is_applied ? "Applied" : "Under Review"),
            interviewScheduled:
              app.interviewScheduled ||
              app.interview_scheduled ||
              app.status === "Interview Scheduled" ||
              app.status === "interview_scheduled",
            experience: (() => {
              const exp = candidate.experience || app.experience;
              if (!exp) return "N/A";
              // Handle if experience is an object
              if (typeof exp === "object" && exp !== null) {
                // Handle array of experience objects
                if (Array.isArray(exp) && exp.length > 0) {
                  return exp
                    .map((e) => {
                      if (typeof e === "object" && e !== null) {
                        const duration = e.duration || e.years || "";
                        const company = e.company_name || "";
                        return company && duration
                          ? `${company} (${duration} years)`
                          : duration
                          ? `${duration} years`
                          : company || "N/A";
                      }
                      return String(e);
                    })
                    .join(", ");
                }
                // Single experience object
                const duration = exp.duration || exp.years || "";
                const company = exp.company_name || "";
                const ctc = exp.ctc ? ` - ${exp.ctc}` : "";
                if (company && duration) {
                  return `${company} (${duration} years)${ctc}`;
                }
                if (duration) {
                  return `${duration} years${ctc}`;
                }
                if (company) {
                  return company;
                }
                return "N/A";
              }
              return String(exp);
            })(),
            resume: app.resume || candidate.resume,
            coverLetter: app.coverLetter || app.cover_letter || app.message,
            // Internal IDs (not displayed)
            jobId: job._id || app.feedId || app.jobId,
            candidateId: candidate._id || app.userId || app.candidateId,
            applicationId: app._id || app.id,
            // Job post details
            jobContent: job.content,
            jobType: Array.isArray(job.job_type)
              ? job.job_type[0]
              : job.job_type,
            workPlaceName: Array.isArray(job.work_place_name)
              ? job.work_place_name[0]
              : job.work_place_name,
            jobCities: Array.isArray(job.cities)
              ? job.cities
              : job.cities
              ? [job.cities]
              : [],
            jobStates: Array.isArray(job.states)
              ? job.states
              : job.states
              ? [job.states]
              : [],
            noticePeriod: job.notice_period,
            isImmediateJoiner: job.is_immediate_joiner,
            jobMedia: job.media || [],
          };
        });

        setMatches(matchData);
        setTotalPages(pagination.totalPages || 1);
        setTotalMatches(pagination.total || matchData.length);
      } catch (error) {
        console.error("Error loading matches:", error);
        setMatches([]);
        setSnackbar({
          open: true,
          message: `Failed to load matches: ${
            error.message || "Unknown error"
          }`,
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "hired":
        return "success";
      case "interview scheduled":
      case "interview_scheduled":
        return "info";
      case "shortlisted":
        return "primary";
      case "applied":
      case "under review":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const handleViewMatch = async (match) => {
    // Fetch detailed match data if needed
    // Use applicationId if available, otherwise use id
    const appId = match.applicationId || match.id;

    if (appId) {
      try {
        const response = await applicationApi.getById(appId);
        const app = response?.data || response;

        // Handle different API response structures
        const candidate = app.user || app.userId || app.candidate || {};
        const job = app.feed || app.feedId || app.job || {};

        const detailedMatch = {
          ...match,
          candidateName:
            candidate.name ||
            candidate.fullName ||
            candidate.username ||
            app.candidateName ||
            match.candidateName,
          candidateEmail:
            candidate.email || app.candidateEmail || match.candidateEmail,
          profileImage:
            candidate.profile_image ||
            candidate.profileImage ||
            app.profile_image ||
            app.profileImage ||
            match.profileImage ||
            null,
          experience: (() => {
            const exp =
              candidate.experience || app.experience || match.experience;
            if (!exp) return "N/A";
            // Handle if experience is an object
            if (typeof exp === "object" && exp !== null) {
              // Handle array of experience objects
              if (Array.isArray(exp) && exp.length > 0) {
                return exp
                  .map((e) => {
                    if (typeof e === "object" && e !== null) {
                      const duration = e.duration || e.years || "";
                      const company = e.company_name || "";
                      const ctc = e.ctc ? ` - ${e.ctc}` : "";
                      return company && duration
                        ? `${company} (${duration} years)${ctc}`
                        : duration
                        ? `${duration} years${ctc}`
                        : company || "N/A";
                    }
                    return String(e);
                  })
                  .join(", ");
              }
              // Single experience object
              const duration = exp.duration || exp.years || "";
              const company = exp.company_name || "";
              const ctc = exp.ctc ? ` - ${exp.ctc}` : "";
              if (company && duration) {
                return `${company} (${duration} years)${ctc}`;
              }
              if (duration) {
                return `${duration} years${ctc}`;
              }
              if (company) {
                return company;
              }
              return "N/A";
            }
            return String(exp);
          })(),
          resume: app.resume || candidate.resume || match.resume,
          coverLetter:
            app.coverLetter ||
            app.cover_letter ||
            app.message ||
            match.coverLetter,
          status: app.status || match.status,
          jobTitle: job.job_title
            ? Array.isArray(job.job_title)
              ? job.job_title[0]
              : job.job_title
            : job.title || match.jobTitle,
          company:
            job.company ||
            (Array.isArray(job.work_place_name)
              ? job.work_place_name[0]
              : job.work_place_name) ||
            match.company,
          // Job post details
          jobContent: job.content || match.jobContent,
          jobType: Array.isArray(job.job_type)
            ? job.job_type[0]
            : job.job_type || match.jobType,
          workPlaceName: Array.isArray(job.work_place_name)
            ? job.work_place_name[0]
            : job.work_place_name || match.workPlaceName,
          jobCities: Array.isArray(job.cities)
            ? job.cities
            : job.cities
            ? [job.cities]
            : match.jobCities || [],
          jobStates: Array.isArray(job.states)
            ? job.states
            : job.states
            ? [job.states]
            : match.jobStates || [],
          noticePeriod:
            job.notice_period !== undefined
              ? job.notice_period
              : match.noticePeriod,
          isImmediateJoiner:
            job.is_immediate_joiner !== undefined
              ? job.is_immediate_joiner
              : match.isImmediateJoiner,
          jobMedia: job.media || match.jobMedia || [],
        };
        setSelectedMatch(detailedMatch);
      } catch (error) {
        console.error("Error fetching match details:", error);
        setSelectedMatch(match); // Use existing data if fetch fails
      }
    } else {
      setSelectedMatch(match);
    }
    setViewDialogOpen(true);
  };

  const handleScheduleInterview = (match) => {
    setSelectedMatch(match);
    setScheduleDialogOpen(true);
  };

  const handleScheduleConfirm = async () => {
    // Use applicationId if available, otherwise use id
    const appId = selectedMatch?.applicationId || selectedMatch?.id;
    if (!appId) return;

    try {
      const interviewData = {
        date: new Date().toISOString(), // You can add a date picker later
        notes: "",
      };

      await applicationApi.scheduleInterview(appId, interviewData);

      // Update local state optimistically
      setMatches((prev) =>
        prev.map((match) => {
          const matchAppId = match.applicationId || match.id;
          const selectedAppId = selectedMatch.applicationId || selectedMatch.id;
          return matchAppId === selectedAppId
            ? {
                ...match,
                status: "Interview Scheduled",
                interviewScheduled: true,
              }
            : match;
        })
      );

      setSnackbar({
        open: true,
        message: `Interview scheduled with ${selectedMatch?.candidateName}`,
        severity: "success",
      });
      setScheduleDialogOpen(false);
    } catch (error) {
      console.error("Error scheduling interview:", error);
      setSnackbar({
        open: true,
        message: `Failed to schedule interview: ${
          error.message || "Unknown error"
        }`,
        severity: "error",
      });
    }
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setScheduleDialogOpen(false);
    setSelectedMatch(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const statusOptions = [
    "All",
    "Applied",
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
          View candidates who applied for jobs - {totalMatches} candidate
          {totalMatches !== 1 ? "s" : ""} found
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
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
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
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading matches...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No matches found. Try adjusting your search or filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match) => (
                <TableRow
                  key={match.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={match.profileImage}
                        alt={match.candidateName}
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
                        <ScheduleIcon
                          sx={{ fontSize: 16, color: "info.main" }}
                        />
                      )}
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src={selectedMatch.profileImage}
                      alt={selectedMatch.candidateName}
                      sx={{ width: 64, height: 64, bgcolor: "primary.main" }}
                    >
                      {selectedMatch.candidateName?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedMatch.candidateName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedMatch.candidateEmail}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Experience:</strong>{" "}
                      {selectedMatch.experience || "N/A"}
                    </Typography>
                  </Box>

                  {selectedMatch.resume && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Resume
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        href={selectedMatch.resume}
                        target="_blank"
                        sx={{ mb: 2 }}
                      >
                        View Resume
                      </Button>
                    </>
                  )}
                  {selectedMatch.coverLetter && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Cover Letter
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 1,
                          maxHeight: 200,
                          overflow: "auto",
                        }}
                      >
                        {selectedMatch.coverLetter}
                      </Typography>
                    </>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Job Post Details
                  </Typography>

                  {selectedMatch.jobMedia &&
                    selectedMatch.jobMedia.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <video
                          src={selectedMatch.jobMedia[0]}
                          controls
                          preload="metadata"
                          style={{
                            width: "100%",
                            maxHeight: 300,
                            borderRadius: 8,
                          }}
                        />
                      </Box>
                    )}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Job Title:</strong> {selectedMatch.jobTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Job Type:</strong>{" "}
                      {selectedMatch.jobType ? (
                        <Chip
                          label={selectedMatch.jobType}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        "N/A"
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Workplace:</strong>{" "}
                      {selectedMatch.workPlaceName || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Cities:</strong>{" "}
                      {selectedMatch.jobCities &&
                      selectedMatch.jobCities.length > 0
                        ? selectedMatch.jobCities.join(", ")
                        : "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>States:</strong>{" "}
                      {selectedMatch.jobStates &&
                      selectedMatch.jobStates.length > 0
                        ? selectedMatch.jobStates.join(", ")
                        : "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Notice Period:</strong>{" "}
                      {selectedMatch.noticePeriod !== undefined
                        ? `${selectedMatch.noticePeriod} days`
                        : "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Immediate Joiner:</strong>{" "}
                      {selectedMatch.isImmediateJoiner !== undefined
                        ? selectedMatch.isImmediateJoiner
                          ? "Yes"
                          : "No"
                        : "N/A"}
                    </Typography>
                    {selectedMatch.jobContent && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Job Description:</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            p: 2,
                            bgcolor: "grey.50",
                            borderRadius: 1,
                            maxHeight: 200,
                            overflow: "auto",
                          }}
                        >
                          {selectedMatch.jobContent}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Applied Date:</strong> {selectedMatch.appliedDate}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Application Status:</strong>{" "}
                      <Chip
                        label={selectedMatch.status}
                        color={getStatusColor(selectedMatch.status)}
                        size="small"
                      />
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
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
