import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Props for the choir-specific form
interface ChoirMemberFormProps {
    formData: {
        voice?: 'Soprano' | 'Alto' | 'Tenor' | 'Bass';
        isCommittee?: boolean;
        [key: string]: any; // other fields (name, email, etc.) are passed but not rendered here
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    mode: 'view' | 'edit';
}

export const ChoirMemberForm: React.FC<ChoirMemberFormProps> = ({ formData, onChange, mode }) => {
    return (
        <>
            {/* Voice Type */}
            <div className="space-y-2">
                <Label htmlFor="voice">Voice Type</Label>
                <select
                    id="voice"
                    name="voice"
                    value={formData.voice || ''}
                    onChange={onChange}
                    disabled={mode === 'view'}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                >
                    <option value="">Select a voice</option>
                    <option value="Soprano">Soprano</option>
                    <option value="Alto">Alto</option>
                    <option value="Tenor">Tenor</option>
                    <option value="Bass">Bass</option>
                </select>
            </div>

            {/* Committee Member Checkbox */}
            <div className="space-y-2">
                <Label htmlFor="isCommittee">Committee Member</Label>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isCommittee"
                        name="isCommittee"
                        checked={formData.isCommittee || false}
                        onChange={(e) =>
                            onChange({
                                target: {
                                    name: 'isCommittee',
                                    value: e.target.checked ? 'true' : 'false',
                                },
                            } as any)
                        }
                        disabled={mode === 'view'}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <label htmlFor="isCommittee" className="text-sm text-muted-foreground">
                        {formData.isCommittee ? 'Yes' : 'No'}
                    </label>
                </div>
            </div>
        </>
    );
};
