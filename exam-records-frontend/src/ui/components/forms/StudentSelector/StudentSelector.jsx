import React, { useState, useEffect } from 'react';
import {
    Autocomplete,
    TextField,
    Checkbox,
    Box,
    Typography,
    Chip,
    FormControl,
    CircularProgress,
    Button,
    ButtonGroup,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    Grid,
    Divider,
    IconButton,
    Tooltip,
    Paper
} from '@mui/material';
import {
    SelectAll,
    ClearAll,
    FilterList,
    Search,
    Person,
    School,
    Clear
} from '@mui/icons-material';
import userRepository from '../../../../repository/userRepository.js';

const StudentSelector = ({
                             value = [],
                             onChange,
                             label = "Students",
                             placeholder = "Search students by name or index...",
                             helperText,
                             disabled = false,
                             multiple = true,
                             hasError = false,
                             required = false
                         }) => {
    const [studentList, setStudentList] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [programFilter, setProgramFilter] = useState('all');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [searchText, setSearchText] = useState('');

    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        const loadStudents = async () => {
            setLoading(true);
            try {
                const response = await userRepository.findAllStudents();
                const students = response.data;
                setStudentList(students);
                setFilteredStudents(students);

                const uniquePrograms = [...new Set(students.map(s => s.studentProgram).filter(Boolean))];

                setPrograms(uniquePrograms);

            } catch (err) {
                setError('Failed to load students');
                console.error('Error loading students:', err);
            } finally {
                setLoading(false);
            }
        };

        loadStudents();
    }, []);

    useEffect(() => {
        let filtered = [...studentList];

        if (programFilter !== 'all') {
            filtered = filtered.filter(student =>
                student.studentProgram === programFilter
            );
        }

        if (searchText) {
            const search = searchText.toLowerCase();
            filtered = filtered.filter(student => {
                const fullName = `${student.name} ${student.surname}`.toLowerCase();
                const index = student.index?.toString().toLowerCase() || '';
                return fullName.includes(search) || index.includes(search);
            });
        }

        setFilteredStudents(filtered);
    }, [studentList, programFilter, searchText]);

    const getOptionLabel = (option) => {
        if (typeof option === 'string') return option;
        return `${option.name} ${option.surname} (${option.index || 'No Index'})`;
    };

    const renderOption = (props, option, { selected }) => (
        <li {...props}>
            <Checkbox
                style={{ marginRight: 8 }}
                checked={selected}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                <Typography variant="body1">
                    {option.name} {option.surname}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Index: {option.index || 'No Index'} | Program: {option.studentProgram || 'No Program'}
                </Typography>
            </Box>
        </li>
    );

    const renderTags = () => [];

    const renderInput = (params) => (
        <TextField
            {...params}
            label={label}
            variant="outlined"
            placeholder={value.length === 0 ? placeholder : "Search to add more students..."}
            helperText={helperText || (multiple ? `${value.length} of ${filteredStudents.length} students selected` : undefined)}
            error={hasError || !!error}
            required={required}
            disabled={disabled}
            InputProps={{
                ...params.InputProps,
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: (
                    <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                    </>
                ),
            }}
        />
    );

    const handleSelectAll = () => {
        if (!multiple) return;
        onChange([...filteredStudents]);
    };

    const handleClearAll = () => {
        onChange(multiple ? [] : null);
    };

    const handleSelectFiltered = () => {
        if (!multiple) return;
        const newStudents = filteredStudents.filter(
            student => !value.some(selected => selected.id === student.id)
        );
        onChange([...value, ...newStudents]);
    };

    const handleRemoveStudent = (studentToRemove) => {
        if (multiple) {
            onChange(value.filter(student => student.id !== studentToRemove.id));
        } else {
            onChange(null);
        }
    };

    const clearFilters = () => {
        setProgramFilter('all');
        setSearchText('');
    };

    const selectedCount = multiple ? value.length : (value ? 1 : 0);
    const totalCount = filteredStudents.length;

    return (
        <FormControl fullWidth>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FilterList />
                        <Typography variant="subtitle1">Filters & Bulk Actions</Typography>
                    </Box>
                    <Button
                        size="small"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        variant="outlined"
                    >
                        {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <ButtonGroup size="small" variant="outlined" disabled={disabled}>
                        <Tooltip title="Select all filtered students">
                            <Button
                                onClick={handleSelectAll}
                                startIcon={<SelectAll />}
                                disabled={!multiple || totalCount === 0}
                            >
                                Select All ({totalCount})
                            </Button>
                        </Tooltip>

                        <Tooltip title="Add filtered students to selection">
                            <Button
                                onClick={handleSelectFiltered}
                                startIcon={<Person />}
                                disabled={!multiple || totalCount === 0}
                            >
                                Add Filtered
                            </Button>
                        </Tooltip>

                        <Tooltip title="Clear all selections">
                            <Button
                                onClick={handleClearAll}
                                startIcon={<ClearAll />}
                                disabled={selectedCount === 0}
                                color="warning"
                            >
                                Clear All
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </Box>

                {showAdvancedFilters && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Program</InputLabel>
                                    <Select
                                        value={programFilter}
                                        onChange={(e) => setProgramFilter(e.target.value)}
                                        label="Program"
                                    >
                                        <MenuItem value="all">All Programs</MenuItem>
                                        {programs.map(program => (
                                            <MenuItem key={program} value={program}>
                                                {program}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    onClick={clearFilters}
                                    startIcon={<Clear />}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                >
                                    Clear Filters
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Paper>

            <Autocomplete
                multiple={multiple}
                options={filteredStudents}
                getOptionLabel={getOptionLabel}
                value={value}
                onChange={(event, newValue) => onChange(newValue)}
                onInputChange={(event, newInputValue) => setSearchText(newInputValue)}
                renderInput={renderInput}
                filterSelectedOptions={false}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={renderOption}
                renderTags={multiple ? renderTags : undefined}
                noOptionsText={
                    searchText || programFilter !== 'all'
                        ? "No students match the current filters"
                        : "No students found"
                }
                loadingText="Loading students..."
                disabled={disabled}
                sx={{
                    '& .MuiAutocomplete-tag': {
                        maxWidth: '200px',
                    }
                }}
            />

            {multiple && value.length > 0 && (
                <Paper sx={{ mt: 2, p: 2, bgcolor: 'primary.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" color="primary.main">
                            <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Selected Students ({value.length})
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={handleClearAll}
                            disabled={disabled}
                            color="warning"
                        >
                            <Clear />
                        </IconButton>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '4px',
                        },
                    }}>
                        {value.map((student) => (
                            <Chip
                                key={student.id}
                                label={`${student.name} ${student.surname}${student.index ? ` (${student.index})` : ''}`}
                                onDelete={disabled ? undefined : () => handleRemoveStudent(student)}
                                color="primary"
                                variant="filled"
                                size="small"
                                sx={{ maxWidth: '250px' }}
                            />
                        ))}
                    </Box>
                </Paper>
            )}

            {!multiple && value && (
                <Box sx={{ mt: 1 }}>
                    <Chip
                        label={`${value.name} ${value.surname} (${value.index || value.index || value.id})`}
                        onDelete={disabled ? undefined : () => handleRemoveStudent(value)}
                        color="primary"
                        variant="outlined"
                        size="small"
                    />
                </Box>
            )}
        </FormControl>
    );
};

export default StudentSelector;