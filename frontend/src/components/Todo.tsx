import { useState } from 'react';
import type { Todo, TodoStatus, UpdateTodoData } from '../types/todo';
import './styles/TodoItem.css';

interface TodoItemProps {
    todo: Todo;
    onUpdate: (id: string, data: UpdateTodoData) => void;
    onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<UpdateTodoData>({});
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ title?: string, description?: string }>({});

    const statusOptions: { value: TodoStatus; label: string; color: string }[] = [
        { value: 'PENDING', label: 'Pending', color: '#ffa726' },
        { value: 'IN_PROGRESS', label: 'In Progress', color: '#42a5f5' },
        { value: 'DONE', label: 'Done', color: '#66bb6a' }
    ];

    const currentStatus = statusOptions.find(opt => opt.value === todo.status);

    // ✅ تابع ولیدیشن جدید
    const validateFields = (data: UpdateTodoData): boolean => {
        const errors: { title?: string, description?: string } = {};

        if (data.title !== undefined) {
            if (!data.title.trim()) {
                errors.title = 'Title is required';
            } else if (data.title.length < 6) {
                errors.title = 'Title must be at least 6 characters';
            }
        }

        if (data.description !== undefined) {
            if (!data.description.trim()) {
                errors.description = 'Description is required';
            } else if (data.description.length < 10) {
                errors.description = 'Description must be at least 10 characters';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const startEditing = () => {
        setEditData({
            title: todo.title,
            description: todo.description
        });
        setValidationErrors({});
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setEditData({});
        setValidationErrors({});
        setIsEditing(false);
    };

    const saveChanges = async () => {
        // ✅ ولیدیشن قبل از ارسال
        if (!validateFields(editData)) {
            return;
        }

        if (Object.keys(editData).length > 0 && hasChanges()) {
            setIsUpdating(true);
            try {
                // ✅ مطمئن شو همه فیلدهای required پر شده‌اند
                const updatePayload: UpdateTodoData = {
                    ...editData,
                    title: editData.title || todo.title, // اگر title تغییر نکرده، از مقدار اصلی استفاده کن
                    description: editData.description || todo.description // اگر description تغییر نکرده، از مقدار اصلی استفاده کن
                };

                await onUpdate(todo.id, updatePayload);
                setIsEditing(false);
                setEditData({});
                setValidationErrors({});
            } catch (error) {
                console.error('Error saving changes:', error);
            } finally {
                setIsUpdating(false);
            }
        } else {
            setIsEditing(false);
            setEditData({});
            setValidationErrors({});
        }
    };

    const handleStatusChange = async (newStatus: TodoStatus) => {
        if (newStatus !== todo.status) {
            setIsUpdating(true);
            try {
                // ✅ برای تغییر status فقط، title و description رو از todo اصلی بفرست
                await onUpdate(todo.id, {
                    status: newStatus,
                    title: todo.title, // ✅ ارسال title اصلی
                    description: todo.description // ✅ ارسال description اصلی
                });
            } catch (error) {
                console.error('Error updating status:', error);
            } finally {
                setIsUpdating(false);
            }
        }
        setShowStatusDropdown(false);
    };

    const handleInputChange = (field: 'title' | 'description', value: string) => {
        setEditData(prev => ({ ...prev, [field]: value }));

        // ✅ ولیدیشن real-time
        if (value.trim()) {
            if (field === 'title' && value.length < 6) {
                setValidationErrors(prev => ({ ...prev, title: 'Title must be at least 6 characters' }));
            } else if (field === 'description' && value.length < 10) {
                setValidationErrors(prev => ({ ...prev, description: 'Description must be at least 10 characters' }));
            } else {
                setValidationErrors(prev => ({ ...prev, [field]: undefined }));
            }
        } else {
            setValidationErrors(prev => ({ ...prev, [field]: `${field} is required` }));
        }
    };

    const hasChanges = () => {
        return (
            (editData.title !== undefined && editData.title !== todo.title) ||
            (editData.description !== undefined && editData.description !== todo.description)
        );
    };

    const canSave = () => {
        if (!hasChanges()) return false;

        // ✅ چک کن که فیلدها valid باشند
        if (editData.title !== undefined && (!editData.title.trim() || editData.title.length < 6)) return false;
        if (editData.description !== undefined && (!editData.description.trim() || editData.description.length < 10)) return false;

        return true;
    };

    return (
        <div className={`todo-item ${todo.status === 'DONE' ? 'completed' : ''} ${isUpdating ? 'updating' : ''}`}>
            <div className="todo-main-content">
                <div className="todo-header">
                    <div className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            checked={todo.status === 'DONE'}
                            onChange={() => handleStatusChange(todo.status === 'DONE' ? 'PENDING' : 'DONE')}
                            className="todo-checkbox"
                            id={`todo-${todo.id}`}
                            disabled={isUpdating}
                        />
                        <label htmlFor={`todo-${todo.id}`} className="checkbox-label"></label>
                    </div>

                    {isEditing ? (
                        <div className="edit-fields">
                            <div className="input-field">
                                <input
                                    type="text"
                                    value={editData.title || ''}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className={`edit-title-input ${validationErrors.title ? 'error' : ''}`}
                                    placeholder="Task title (min 6 characters)"
                                    disabled={isUpdating}
                                />
                                {validationErrors.title && (
                                    <span className="error-message">{validationErrors.title}</span>
                                )}
                            </div>
                            <div className="input-field">
                                <textarea
                                    value={editData.description !== undefined ? editData.description : ''}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className={`edit-description-input ${validationErrors.description ? 'error' : ''}`}
                                    placeholder="Task description (min 10 characters)"
                                    rows={3}
                                    disabled={isUpdating}
                                />
                                {validationErrors.description && (
                                    <span className="error-message">{validationErrors.description}</span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div
                            className="content-display"
                            onClick={startEditing}
                            style={{ cursor: 'pointer' }}
                        >
                            <span className={`todo-title ${todo.status === 'DONE' ? 'completed' : ''}`}>
                                {todo.title}
                            </span>
                            {todo.description && (
                                <p className="todo-description">
                                    {todo.description}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="status-section">
                        <div className="status-dropdown-container">
                            <button
                                className="status-button"
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                style={{ backgroundColor: currentStatus?.color }}
                                disabled={isUpdating}
                            >
                                {currentStatus?.label}
                                {isUpdating ? '⏳' : <span className="dropdown-arrow">▼</span>}
                            </button>

                            {showStatusDropdown && (
                                <div className="status-dropdown">
                                    {statusOptions.map(option => (
                                        <button
                                            key={option.value}
                                            className="status-option"
                                            onClick={() => handleStatusChange(option.value)}
                                            style={{
                                                backgroundColor: option.color,
                                                opacity: option.value === todo.status ? 0.7 : 1
                                            }}
                                            disabled={isUpdating}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isEditing && hasChanges() && (
                    <div className="edit-confirmation">
                        <div className="confirmation-content">
                            <span>Save changes?</span>
                            <div className="confirmation-buttons">
                                <button
                                    onClick={saveChanges}
                                    className="confirm-btn"
                                    disabled={isUpdating || !canSave()}
                                >
                                    {isUpdating ? 'Saving...' : 'Yes'}
                                </button>
                                <button
                                    onClick={cancelEditing}
                                    className="cancel-btn"
                                    disabled={isUpdating}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                        {!canSave() && (
                            <div className="validation-hint">
                                ⚠️ Title (min 6 chars) and Description (min 10 chars) are required
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="todo-actions">
                {isEditing ? (
                    <>
                        <button
                            onClick={saveChanges}
                            className="todo-btn save-btn"
                            title="Save changes"
                            disabled={isUpdating || !canSave()}
                        >
                            {isUpdating ? '⏳' : '💾'}
                        </button>
                        <button
                            onClick={cancelEditing}
                            className="todo-btn cancel-btn"
                            title="Cancel editing"
                            disabled={isUpdating}
                        >
                            ❌
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={startEditing}
                            className="todo-btn edit-btn"
                            title="Edit todo"
                            disabled={isUpdating}
                        >
                            ✏️
                        </button>
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="todo-btn delete-btn"
                            title="Delete todo"
                            disabled={isUpdating}
                        >
                            🗑️
                        </button>
                    </>
                )}
            </div>

            {isUpdating && <div className="updating-overlay">Updating...</div>}
        </div>
    );
}