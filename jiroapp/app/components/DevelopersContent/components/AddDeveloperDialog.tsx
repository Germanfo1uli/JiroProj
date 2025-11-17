import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Box,
    Typography
} from '@mui/material';
import { FaPlus, FaUserPlus } from 'react-icons/fa';
import { NewDeveloper, DeveloperRole } from '../types/developer.types';

interface AddDeveloperDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (developer: NewDeveloper) => void;
    newDeveloper: NewDeveloper;
    onNewDeveloperChange: (developer: NewDeveloper) => void;
}

export const AddDeveloperDialog = ({
                                       open,
                                       onClose,
                                       onAdd,
                                       newDeveloper,
                                       onNewDeveloperChange
                                   }: AddDeveloperDialogProps) => {
    const handleSubmit = () => {
        if (newDeveloper.name.trim()) {
            onAdd(newDeveloper);
        }
    };

    const handleClose = () => {
        onNewDeveloperChange({ name: '', role: 'executor' });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    padding: '8px',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    minWidth: '400px'
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    padding: '24px 24px 16px'
                }}
            >
                <FaUserPlus style={{ fontSize: '20px' }} />
                Добавить участника
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2, padding: '0 8px' }}>
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#64748b',
                                marginBottom: 1,
                                fontSize: '0.9rem'
                            }}
                        >
                            Введите полное имя участника для добавления в проект
                        </Typography>
                        <TextField
                            label="Имя и фамилия участника"
                            placeholder="например: Иван Иванов"
                            value={newDeveloper.name}
                            onChange={(e) => onNewDeveloperChange({...newDeveloper, name: e.target.value})}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: '#3b82f6'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3b82f6',
                                        borderWidth: '2px'
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#3b82f6'
                                }
                            }}
                        />
                    </Box>

                    <FormControl fullWidth>
                        <InputLabel>Роль в проекте</InputLabel>
                        <Select
                            value={newDeveloper.role}
                            label="Роль в проекте"
                            onChange={(e) => onNewDeveloperChange({...newDeveloper, role: e.target.value as DeveloperRole})}
                            sx={{
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#3b82f6'
                                }
                            }}
                        >
                            <MenuItem value="executor">Разработчик</MenuItem>
                            <MenuItem value="assistant">Помощник разработчика</MenuItem>
                            <MenuItem value="leader" disabled>
                                Руководитель (только для существующих участников)
                            </MenuItem>
                        </Select>
                    </FormControl>

                </Box>
            </DialogContent>

            <DialogActions sx={{ padding: '20px 24px', gap: 1 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#64748b',
                        borderColor: 'rgba(100, 116, 139, 0.3)',
                        padding: '8px 20px',
                        '&:hover': {
                            borderColor: '#64748b',
                            background: 'rgba(100, 116, 139, 0.04)'
                        }
                    }}
                >
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    startIcon={<FaPlus />}
                    disabled={!newDeveloper.name.trim()}
                    sx={{
                        background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        padding: '8px 24px',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                        },
                        '&:disabled': {
                            background: 'rgba(100, 116, 139, 0.2)',
                            color: 'rgba(100, 116, 139, 0.5)'
                        }
                    }}
                >
                    Добавить участника
                </Button>
            </DialogActions>
        </Dialog>
    );
};