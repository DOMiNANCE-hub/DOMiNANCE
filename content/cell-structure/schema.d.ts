export interface CellLesson { id: string; title: string; markdown: string; references?: string[]; attribution?: string }
export interface CellQuestion { id: string; lesson: string; question: string; options: [string,string,string,string]; letter: 'A'|'B'|'C'|'D'; explanation: string }
export interface CellContent { version: 1; status: 'academic-review-pending'; course: 'Cell Structure'; scope: 'HB1:First'; lessons: CellLesson[]; questions: CellQuestion[] }
export interface CellAnswer { question: string; option: 0|1|2|3|null }
export interface CellAttempt { id: string; completedAt: string; answers: CellAnswer[] }
export interface CellLegacyDraft { id: string; questions: string[]; index: number; answers: CellAnswer[]; selected: 0|1|2|3|null; checked: boolean }
export interface CellDraft { format: 2; id: string; questions: string[]; index: number; responses: Record<string,0|1|2|3>; phase: 'answer'|'review' }
export interface CellState { version: 1; lessons: Record<string,string>; attempts: CellAttempt[]; draft: CellDraft|CellLegacyDraft|null; reading?: Record<string, CellReadingPosition> }
export interface CellReadingPosition { section: string; part?: number; offset: number; updatedAt: string }
// Reading is account-owned. section retains the stable lesson ID; optional part is a zero-based section.
// Older positions without part remain valid; their old continuous-lesson offset is not guessed onto a new section.
// Legacy owned quiz drafts upgrade on explicit resume. Neither read markers nor offsets represent mastery.
