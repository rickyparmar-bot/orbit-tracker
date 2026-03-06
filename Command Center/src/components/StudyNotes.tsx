import React from 'react';

interface StudyNotesProps {
    content?: string;
}

export const StudyNotes: React.FC<StudyNotesProps> = ({ content }) => {
    if (content) {
        return (
            <div
                className="god-sheet-container animate-in fade-in slide-in-from-bottom-4 duration-1000 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }

    return (
        <div className="god-sheet-container animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="p-12 text-center text-text-muted">
                <p>No study notes available for this sub-topic yet.</p>
            </div>
        </div>
    );
};
