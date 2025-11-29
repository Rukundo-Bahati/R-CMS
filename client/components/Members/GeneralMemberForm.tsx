import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { initialFamilies } from '@/data/families';

// Props for the general (non‑choir) member form
interface GeneralMemberFormProps {
    formData: {
        department?: string;
        familyId?: string;
        [key: string]: any; // other fields are passed but not rendered here
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    mode: 'view' | 'edit';
}

export const GeneralMemberForm: React.FC<GeneralMemberFormProps> = ({ formData, onChange, mode }) => {
    return (
        <>
            {/* Department */}
            <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                    id="department"
                    name="department"
                    value={formData.department || ''}
                    onChange={onChange}
                    disabled={mode === 'view'}
                />
            </div>

            {/* Family selector */}
            <div className="space-y-2">
                <Label htmlFor="familyId">Family</Label>
                <select
                    id="familyId"
                    name="familyId"
                    value={formData.familyId || ''}
                    onChange={onChange}
                    disabled={mode === 'view'}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                >
                    <option value="">Select a family</option>
                    {initialFamilies.map((family) => (
                        <option key={family.id} value={family.id}>
                            {family.name} ({family.generation})
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};
